import os
import json
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from collections import defaultdict
from datetime import datetime
import copy

from config import Config

import csv
import io
import pprint
import shutil
import json

pp = pprint.PrettyPrinter(indent=4)

application = Flask(__name__)
application.config.from_object(Config)

application.config["MONGO_URI"] = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + \
    os.environ['MONGODB_PASSWORD'] + '@' + os.environ['MONGODB_HOSTNAME'] + \
    ':27017/' + os.environ['MONGODB_DATABASE']

mongo = PyMongo(application)
db = mongo.db

cors = CORS(application, resources={r"*": {"origins": "*"}})

pp = pprint.PrettyPrinter(indent=4)

IMAGES_UPLOAD_FOLDER = application.config['IMAGES_UPLOAD_FOLDER']
DATE_FORMAT_INPUT = application.config['DATE_FORMAT_INPUT']
DATE_FORMAT_OUTPUT = application.config['DATE_FORMAT_OUTPUT']
FOLDER_DATE_STRUCTURE = application.config['FOLDER_DATE_STRUCTURE']


class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


application.json_encoder = JSONEncoder


def get_datetime(date):
    return datetime.strptime(date, DATE_FORMAT_INPUT)


def format_date(date):
    return datetime.strptime(date, DATE_FORMAT_INPUT).strftime(DATE_FORMAT_OUTPUT)


def get_timestamp(date):
    return get_datetime(date).timestamp()


def init_order(row):
    is_stop = row[10] == 'Stop'
    time = format_date(row[17])
    is_short = row[8] == 'Y'
    qty = int(row[12])

    order = {
        'category': 0,
        'account': row[2],
        'id': row[0],
        'route': row[4],
        'type': row[7],
        'short': is_short,
        'is_stop': is_stop,
        'market_type': row[9],
        'ticker': row[11],
        'qty': qty,
        'price': float(row[14]),
        'time': time
    }

    if is_stop:
        order['stop_price'] = float(row[15])
        order['trail_price'] = float(row[16])

    return order


def init_trade(row):
    order_id = row[1]
    price = float(row[13])
    time = format_date(row[14])
    timestamp = get_timestamp(row[14])
    is_short = row[9] == 'Y'
    account = row[3]
    qty = int(row[12])

    commissions = 0
    if account == 'TRPCT0094':
        commissions = round(0.005 * qty, 4)

    # id that we use for a trade
    id = row[11] + "-" + str(int(timestamp))

    return {
        'category': 1,
        'id': id,
        'account': account,
        'trader': row[2],
        'ticker': row[11],
        'time': time,
        'qty': qty,
        'market_type': row[10],
        'price': price,
        'type': row[8],
        'short': is_short,
        'trade_id': row[0],
        'route': row[5],
        'order_id': order_id,
        'timestamp': timestamp,
        'strategy': '',
        'description': '',
        'review': '',
        'catalysts': [],
        'rulesRespected': [],
        'rvol': None,
        'rating': None,
        'commissions': commissions
    }


def get_duration(entry_time, exit_time):
    datetime_a = datetime.strptime(entry_time, DATE_FORMAT_OUTPUT)
    datetime_b = datetime.strptime(exit_time, DATE_FORMAT_OUTPUT)
    return datetime_b - datetime_a


def get_gain(trades):
    gain = 0
    buy = 0
    sell = 0

    for trade in trades:
        if trade.get('type') == 'B':
            buy += trade.get('price') * trade.get('qty')

        if trade.get('type') == 'S':
            sell += trade.get('price') * trade.get('qty')

    gain = sell - buy

    return round(gain, 2)


def get_nb_shares(filled_actions):
    nb_shares = 0
    for action in filled_actions:
        nb_shares += action.get('qty', 0)

    return nb_shares


def get_slippage(order_actions):
    slippage = 0
    for order in order_actions:
        if order['is_stop'] == False and order.get('slippage') != None:
            slippage += (order['slippage'] * order['qty'])

    return round(slippage, 2)


def consolidate_trade(all_trades, built_trades, orders_dictionary):
    if len(all_trades) == 0:
        return built_trades

    initial_trade = all_trades[0]
    initial_trade['strategy'] = ""
    initial_trade['description'] = ""
    initial_trade['actions'] = []

    my_init_trade = copy.deepcopy(initial_trade)

    # Remove first trade of the list, since it's the main one,
    # we don't want to have it here
    all_trades.pop(0)

    init_size = initial_trade.get('qty')

    order_id = initial_trade['order_id']
    my_order = orders_dictionary[order_id]
    entry_time = my_order['time']
    trade_entry_time = datetime.strptime(
        entry_time, DATE_FORMAT_OUTPUT).timestamp()

    while init_size >= 0:
        if len(all_trades) == 0:
            return built_trades

        next_trade = all_trades[0]

        # LONG
        if initial_trade.get('type') == 'B':
            # Add LONG
            if next_trade.get('type') == 'B':
                next_size = init_size + next_trade.get('qty')
            # Sell
            if next_trade.get('type') == 'S':
                next_size = init_size - next_trade.get('qty')

        # SHORT
        if initial_trade.get('type') == 'S':
            # Add SHORT
            if next_trade.get('type') == 'S':
                next_size = init_size + next_trade.get('qty')
            # Cover
            if next_trade.get('type') == 'B':
                next_size = init_size - next_trade.get('qty')

        init_size = next_size

        all_trades.pop(0)
        initial_trade['actions'].append(next_trade)

        # Trade is consolidated
        if next_size == 0:
            exit_time = next_trade.get('time')
            trade_exit_time = datetime.strptime(
                exit_time, DATE_FORMAT_OUTPUT).timestamp()

            for order in orders_dictionary:
                my_order = orders_dictionary[order]
                if (
                    initial_trade.get('ticker') == my_order.get(
                        'ticker') and initial_trade.get('account') == my_order.get('account')
                ):
                    order_time = datetime.strptime(
                        my_order.get('time'), DATE_FORMAT_OUTPUT).timestamp()
                    if trade_entry_time <= order_time <= trade_exit_time:
                        initial_trade['actions'].append(my_order)

            initial_trade['actions'].append(my_init_trade)
            initial_trade['actions'].sort(
                key=lambda action: (action['time'], action['category']))

            # Filter all Orders to have only those that were filled
            trade_actions = list(filter(lambda action: action.get(
                'category') == 1, initial_trade.get('actions', [])))

            # Add slippage to each order
            order_actions = list(filter(lambda action: action.get(
                'category') == 0, initial_trade.get('actions', [])))
            for trade in trade_actions:
                my_order_id = trade['order_id']
                for order in order_actions:
                    order['slippage'] = 0
                    if order['id'] == my_order_id:
                        if initial_trade['type'] == 'B':
                            order['slippage'] = round(
                                trade['price'] - order['price'], 2)
                        if initial_trade['type'] == 'S':
                            order['slippage'] = round(
                                order['price'] - trade['price'], 2)

            # calculate gain for this trade
            gross_gain = get_gain(trade_actions)
            initial_trade['gross_gain'] = gross_gain

            # risk parameters

            # Filter Orders to have all the STOPS
            # Find the first entry
            stop_actions = list(filter(
                lambda action: action.get('is_stop', False) == True, initial_trade.get('actions', [])))
            initial_stop = 0
            stop_distance = 0
            risk = 35
            stop_ratio = 0

            if len(stop_actions) > 0:
                initial_stop = stop_actions[0].get('stop_price')
                stop_distance = round(
                    abs(initial_trade.get('price') - initial_stop), 4)
                stop_ratio = stop_distance / initial_trade.get('price')
                # risk = stop_distance * initial_trade.get('qty')

            if risk > 0 and gross_gain != 0:
                r = round(gross_gain / risk, 2)

            initial_trade['r'] = r
            initial_trade['stop_distance'] = round(stop_distance, 2)
            initial_trade['risk'] = round(risk, 2)
            initial_trade['stop_ratio'] = round(stop_ratio, 4)

            nb_shares = get_nb_shares(trade_actions)
            initial_trade['nb_shares'] = nb_shares

            commissions = 0.0035 * nb_shares
            if commissions < 0.35:
              commissions = 0.35
            initial_trade['commissions'] = 0.005 * nb_shares
            initial_trade['ratio_com_gain'] = round(abs(commissions / gross_gain), 4)
            initial_trade['net_gain'] = round(gross_gain - commissions, 4)

            # slippage
            initial_trade['slippage'] = get_slippage(order_actions)

            initial_trade['img'] = []

            # add duration of trade using first entry and last partial
            duration = get_duration(entry_time, exit_time)
            initial_trade['duration'] = str(duration)

            built_trades.append(initial_trade)

            # continue iteration
            consolidate_trade(all_trades, built_trades, orders_dictionary)

    if next_size < 0:
        # Size error (hotkey mistake ?)
        # 1) I was Long 100, then sold 150, now I'm Short 50
        # 2) I was Short 100, then covered (bought) 150, now I'm long 50
        # In these cases we close current trade
        # TODO
        # Create a new Trade dictionary with the right
        # amount of shares to close the initial trade
        # Use only the difference in shares size (50 in the examples)

        # Then create a new Trade dictionary, with the remainming shares
        # need to push this new entry to all_trades
        consolidate_trade(all_trades, built_trades, orders_dictionary)


@application.route('/trades', methods=['GET'])
def list_trades():
    ''' route to get the trades '''
    if request.method == 'GET':
        if request.args:
            startTimestamp = int(request.args['start'])
            endTimestamp = int(request.args['end'])
            matching_trades = db.trades.find(
                {"timestamp": {"$gte": startTimestamp, "$lte": endTimestamp}})
            return_data = list(matching_trades)
            return jsonify({'ok': True, 'trades': return_data})

        allTrades = db.trades.aggregate([{'$sort': {'timestamp': 1}}])
        return_data = list(allTrades)
        return jsonify({'ok': True, 'trades': return_data})


@application.route('/overviews', methods=['GET'])
def get_overview():
    ''' route to get one or more overview(s) '''
    if request.method == 'GET':
        if request.args:
            startTimestamp = int(request.args['start'])
            endTimestamp = int(request.args['end'])
            matching_overviews = db.overviews.aggregate([{'$match': {"timestamp": {
                                                        '$gte': startTimestamp, '$lte': endTimestamp}}}, {'$sort': {'timestamp': 1}}])
            return_data = list(matching_overviews)
            return jsonify({'ok': True, 'overviews': return_data})


@application.route('/seeds', methods=['GET'])
def get_seeds():
    ''' route to get seeds for an Overview '''
    if request.method == 'GET':
        if request.args:
            startTimestamp = int(request.args['start'])
            endTimestamp = int(request.args['end'])
            matching_seeds = db.seeds.find(
                {"timestamp": {"$gte": startTimestamp, "$lte": endTimestamp}})
            return_data = list(matching_seeds)
            return jsonify({'ok': True, 'seeds': return_data})


@application.route('/importTrades', methods=['GET', 'POST'])
def post_raw_data():
    ''' route to post raw data '''
    if request.method == 'POST':
        # Build Orders
        csv_orders = request.files['ordersInput']
        orders_stream = io.StringIO(
            csv_orders.stream.read().decode("UTF8"), newline=None)
        next(orders_stream, None)  # skip the headers
        csv_orders_list = list(csv.reader(orders_stream))
        # sort orders by time
        csv_orders_list.sort(key=lambda t: t[17])
        orders_dictionary = {}

        for i, row in enumerate(csv_orders_list):
            order = init_order(row)
            orders_dictionary[row[0]] = order

            # stop_order = None
            # For each order that is not a stop we look if the next order is the stop order
            # corresponding to the buy or short order we are iterating over.
            # This allows to find the total risk of the trade and to get the R:R
            # is_short = order['type'] == 'S' and order['short'] == True and order['is_stop'] == False
            # is_long = order['type'] == 'B' and order['short'] == False and order['is_stop'] == False

            # if i < len(csv_orders_list) - 1 and (is_short or is_long):
                # stop_order = csv_orders_list[i+1]
                # There is an issue here, that I don't know how to fix:
                # It's gonna add order_risk to a Cover order because when we parse the orders
                # and we see a Buy order, it could be a Cover, but we don't know yet so it
                # still process it
                # The only fix is to remove order_risk afterward (see 'order_risk Note')
                # should_process = False
                # if is_short:
                    # should_process = order['short'] == True and order['type'] == 'S'
                # if is_long:
                    # should_process = order['type'] == 'B'
                # if stop_order[11] == order['ticker'] and should_process:
                    # order['order_risk'] = round(
                        # abs(order.get('price', 0) - float(stop_order[15])), 4)

        # Build Trades
        csv_trades = request.files['tradesInput']
        trades_stream = io.StringIO(
            csv_trades.stream.read().decode("UTF8"), newline=None)
        next(trades_stream, None)  # skip the headers
        csv_trades_input = csv.reader(trades_stream)
        trades_dictionary = {}

        for row in csv_trades_input:
            # Find corresponding order
            # order_id = row[1]
            # my_order = orders_dictionary[order_id]
            # if order_id:
                # my_order['filled'] = True
                # my_order['filled_time'] = format_date(row[14])
            trade = init_trade(row)

            # When we create a trade we need to remember the original price
            # to calculate the slippage
            # orders_dictionary[order_id]['price'] = trade['price']

            currentTicker = row[11]
            currentUser = row[3]

            # Group all Trades by User and Ticker
            if currentUser in trades_dictionary:
                if currentTicker in trades_dictionary[currentUser]:
                    trades_dictionary[currentUser][currentTicker].append(trade)
                else:
                    trades_dictionary[currentUser].update(
                        {currentTicker: [trade]})
            else:
                trades_dictionary[currentUser] = {currentTicker: [trade]}

        # sort by date and time
        for user in trades_dictionary:
            for ticker in trades_dictionary[user]:
                trades_dictionary[user][ticker].sort(key=lambda t: t['time'])

        trades_dictionary_copy = copy.deepcopy(trades_dictionary)

        # then we build aggregated trades
        all_my_trades = []

        # Consolidate all Trades
        for user in trades_dictionary:
            for trade in trades_dictionary[user]:
                all_my_trades.extend(consolidate_trade(
                    trades_dictionary_copy[user][trade], [], orders_dictionary))

        # all aggregated trades
        db.trades.insert_many(all_my_trades)

        # compute total for the day
        # we find the date of the day and store the total in the `overviews` collection
        # per account
        # We also put net and gross pnl for later being able to process commissions

        pnl_by_accounts = {}
        for trade in all_my_trades:
            if trade.get('account') in pnl_by_accounts:
                new_pnl = round(
                    pnl_by_accounts[trade['account']]['net'] + trade.get('gross_gain', 0), 2)
                new_r = round(
                    pnl_by_accounts[trade['account']]['r'] + trade.get('r', 0), 2)
                pnl_by_accounts.update(
                    {trade.get('account'): {'gross': new_pnl, 'net': new_pnl, 'account': trade['account'], 'r': new_r}})
            else:
                new_pnl = round(trade.get('gross_gain', 0), 2)
                new_r = round(trade.get('r', 0), 2)
                pnl_by_accounts.update(
                    {trade.get('account'): {'gross': new_pnl, 'net': new_pnl, 'account': trade['account'], 'r': new_r}})

        overview_id = all_my_trades[0].get('time')[:10]
        overview_id = overview_id.replace('/', '-')

        db.overviews.update_one(
            {'id': overview_id},
            {"$set": {
              'id': overview_id,
                'accounts': pnl_by_accounts,
                'timestamp': trade.get('timestamp')
            }
            }, upsert=True
        )

        return jsonify({'ok': True, 'aggregatedTrades': all_my_trades})


@application.route('/uploadImages', methods=['POST'])
def post_trade_images():
    if request.method == 'POST':
        image_type = request.args['type']
        day = request.args['day']
        image_pathes = []
        trade_id = ''
        overview_id = ''

        if image_type == 'seed':
            # filename should be this format
            # date-seedId-index
            # ex: 12-14-2020-AMD-orb-1802-0.PNG
            seed_id = request.args['id']
            for i, seed_image in enumerate(request.files):
                dayArr = day.split('-')
                year_val = dayArr[2]
                month_val = dayArr[0]
                day_val = dayArr[1]
                date_path = os.path.join(year_val, month_val, day_val)
                try:
                    os.makedirs(os.path.join(IMAGES_UPLOAD_FOLDER, date_path))
                except FileExistsError:
                    # directory already exists
                    print('Folder already exists')
                file = request.files[seed_image]

                saved_images = os.listdir(os.path.join(
                    IMAGES_UPLOAD_FOLDER, date_path))
                base_index = len(saved_images)
                image_final_name = seed_id + '_' + str(base_index) + '.PNG'

                # image_final_name = seed_id + '.PNG'
                filename = secure_filename(image_final_name)
                image_full_path = os.path.join(
                    IMAGES_UPLOAD_FOLDER, date_path, filename)

                file.save(image_full_path)
                image_pathes.append(image_full_path)

                db.seeds.update_one(
                    {'id': seed_id},
                    {"$push": {
                        # 'img': date_path + '/' + filename
                        'img': filename
                    }
                    }, upsert=True
                )

        if image_type == 'overview':
            # filename should be this format
            # date-index
            # ex: 9-01-2020-0
            for i, overview_image in enumerate(request.files):
                dayArr = day.split('-')
                year_val = dayArr[2]
                month_val = dayArr[0]
                day_val = dayArr[1]
                date_path = os.path.join(year_val, month_val, day_val)
                try:
                    os.makedirs(os.path.join(IMAGES_UPLOAD_FOLDER, date_path))
                except FileExistsError:
                    # directory already exists
                    print('Folder already exists')
                overview_id = overview_image.split('/')[0]
                overview_img_name = overview_image.split('/')[0]
                file = request.files[overview_image]

                saved_images = os.listdir(os.path.join(
                    IMAGES_UPLOAD_FOLDER, date_path))
                base_index = len(saved_images)
                image_final_name = overview_img_name + \
                    '-' + str(base_index) + '.PNG'

                filename = secure_filename(image_final_name)
                image_full_path = os.path.join(
                    IMAGES_UPLOAD_FOLDER, date_path, filename)

                file.save(image_full_path)
                image_pathes.append(image_full_path)

                db.overviews.update_one(
                    {'id': overview_id},
                    {"$push": {
                        # 'img': date_path + '/' + filename
                        'img': filename
                    }
                    }, upsert=True
                )

        if image_type == 'trade':
            # filename should be this format
            # ticker-timestamp-index
            # ex: QGEN-1574098671-1

            for trade_image in request.files:
                dayArr = day.split('-')
                year_val = dayArr[2]
                month_val = dayArr[0]
                day_val = dayArr[1]
                date_path = os.path.join(year_val, month_val, day_val)
                try:
                    os.makedirs(os.path.join(IMAGES_UPLOAD_FOLDER, date_path))
                except FileExistsError:
                    # directory already exists
                    print('Folder already exists')
                saved_images = os.listdir(os.path.join(
                    IMAGES_UPLOAD_FOLDER, date_path))
                base_index = len(saved_images)
                timestamp = request.files[trade_image].filename.split('-')[1]
                trade_id = trade_image.split('-')[0] + '-' + timestamp
                file = request.files[trade_image]
                image_original_index = int(file.filename.split('-')[2])
                final_image_index = str(image_original_index + base_index)
                image_final_name = trade_id + '-' + final_image_index + '.PNG'

                filename = secure_filename(image_final_name)
                image_full_path = os.path.join(
                    IMAGES_UPLOAD_FOLDER, date_path, filename)

                file.save(image_full_path)
                image_pathes.append(image_full_path)

                db.trades.update_one(
                    {'id': trade_id},
                    {"$push": {
                        'img': filename
                    }
                    }, upsert=False
                )

        return jsonify({'ok': True, 'tradeId': trade_id, 'imagePathes': image_pathes, 'type': image_type, 'overview_id': overview_id})


@application.route('/editTrade', methods=['GET', 'PUT'])
def edit_trade_data():
    ''' route to edit a trade '''
    if request.method == 'PUT':
        trade = request.json['trade']
        details = request.json['data']
        my_trade = db.trades.find_one({'id': trade['id']})
        net_gain = None
        ratio_gain_commissions = None

        if details.get('commissions'):
            commissions = float(details.get('commissions'))
            gross_gain = my_trade.get('gross_gain', 0)
            net_gain = round(gross_gain - commissions, 2)
            ratio_gain_commissions = round(abs(commissions / gross_gain), 4)
        else:
            commissions = my_trade['commissions']
        
        if len(details.get('strategy', '')) > 0:
            strategy_value = details.get('strategy')
        else:
            strategy_value = my_trade['strategy']

        if details.get('r'):
            r = float(details.get('r'))
        else:
          r = my_trade['r']

        db.trades.update_one(
            {'id': trade['id']},
            {"$set": {
                'strategy': strategy_value,
                'description': details.get('description', my_trade['description']),
                'review': details.get('review', my_trade['review']),
                'catalysts': details.get('catalysts'),
                'rulesRespected': details.get('rulesRespected', []),
                'rvol': details.get('rvol', my_trade['rvol']),
                'rating': details.get('rating', my_trade['rating']),
                'commissions': commissions,
                'r': r,
                'net_gain': net_gain,
                'ratio_com_gain': ratio_gain_commissions
              }
            }, upsert=False
        )

        corresponding_trades = []

        # If we edited a trade and added the commission
        # we need to reflect that on the daily PnL
        if details.get('commissions') != my_trade.get('commissions'):
            overview_id = my_trade.get('time')[:10]
            overview_id = overview_id.replace('/', '-')

            my_overview = db.overviews.find_one({'id': overview_id})
            my_overview_net_pnl_for_account = my_overview['accounts'][my_trade.get(
                'account')]['gross']

            corresponding_trades = db.trades.aggregate([
                {
                    '$match': {
                        "time": {'$regex': my_trade.get('time')[:10]},
                        "account": {'$regex': my_trade.get('account')},
                    },
                }
            ])

            for corresponding_trade in corresponding_trades:
                if corresponding_trade.get('commissions'):
                    my_overview_net_pnl_for_account -= corresponding_trade.get(
                        'commissions')

            my_overview_net_pnl_for_account = round(
                my_overview_net_pnl_for_account, 2)

            my_overview['accounts'].get(my_trade.get('account')).update(
                {"net": my_overview_net_pnl_for_account})

            db.overviews.update_one(
                {'id': overview_id},
                {"$set": my_overview}, upsert=True
            )

        if details.get('r') != my_trade.get('r'):
           r_diff = my_trade.get('r') - float(details.get('r'))
           original_r = my_overview['accounts'][my_trade.get('account')]['r']

           my_overview['accounts'].get(my_trade.get('account')).update(
                {"r": round(original_r - r_diff, 2)})
           db.overviews.update_one(
                {'id': overview_id},
                {"$set": my_overview}, upsert=True
            )

        return jsonify({'ok': True, 'tradeID': trade['_id']})

@application.route('/editSeed', methods=['GET', 'PUT'])
def edit_seed_data():
    ''' route to edit a seed '''
    if request.method == 'PUT':
        details = request.json['data']
        seed = request.json['seed']
        seed_id = seed.get('id', details['id'])
        db.seeds.update_one(
            {'id': seed_id},
            {"$set": {
              'description': details['description'],
              'isLong': details['isLong'],
              'price': details['price'],
              'ticker': details['ticker'],
              'strategy': details['strategy'],
              'timestamp': details['timestamp'],
              'time': details['time'],
              'rulesRespected': details.get('rulesRespected', [])
            }
            }, upsert=True
        )
        return_data = db.seeds.find_one({"id": seed_id})
        return jsonify({'ok': True, 'seed': return_data})

@application.route('/deleteSeed', methods=['GET', 'PUT'])
def delete_seed_data():
    ''' route to delete a seed '''
    if request.method == 'PUT':
        seed_id = request.json['seedId']
        db.seeds.delete_one(
            {'id': seed_id}
        )
        return jsonify({'ok': True, 'seedId': seed_id})

@application.route('/editTradeLink', methods=['GET', 'PUT'])
def edit_trade_link():
    ''' route to edit a trade <-> seed link '''
    if request.method == 'PUT':
      current_seed_id = request.json['currentSeedId']
      new_seed_id = request.json['newSeedId']
      trade_id = request.json['tradeId']

      linked_trades = []
      my_seed = {}

      # Unlinking a trade
      if new_seed_id == "unlink" and len(current_seed_id) > 0:
        my_seed = db.seeds.find_one({'id': current_seed_id})
        linked_trades = my_seed.get('linked_trades', [])
        try:
          linked_trades.remove(trade_id)
        except:
          print('Tried to Unlink a Trade that was not linked')

      # Linking a unlinked trade
      elif current_seed_id == "" and new_seed_id:
        my_seed = db.seeds.find_one({'id': new_seed_id})
        linked_trades = my_seed.get('linked_trades', [])
        linked_trades.append(trade_id)

      else:
        print('Please unlink the trade before making a new link.')

      if my_seed:
        db.seeds.update_one(
          {'id': my_seed['id']},
          {"$set": {
            'linked_trades': linked_trades
            }
          }, upsert=True
        )
        # update trade strategy with seed data
        db.trades.update_one(
          {'id': trade_id},
          {"$set": {
            'strategy': my_seed['strategy']
            }
          }, upsert=True
        )
        return_data = db.seeds.find_one({"id": my_seed['id']})
        return jsonify({'ok': True, 'seed': return_data})
      else:
        return jsonify({'ok': False})

@application.route('/editOverview', methods=['GET', 'PUT'])
def edit_overview_data():
    ''' route to edit an overview '''
    if request.method == 'PUT':
        overview = request.json['overview']
        details = request.json['data']
        overview_id = overview.get('id', details['id'])
        db.overviews.update_one(
            {'id': overview_id},
            {"$set": {
                'description': details['description'],
                'timestamp': details.get('timestamp')
            }
            }, upsert=True
        )
        return_data = db.overviews.find_one({"id": overview_id})
        return jsonify({'ok': True, 'overview': return_data})


@application.route('/importImages', methods=['GET'])
def send_image():
    imgFilename = request.args['filename']
    imgPath = request.args['path']
    return send_from_directory(IMAGES_UPLOAD_FOLDER + '/' + imgPath, imgFilename, as_attachment=True)

@application.route('/deleteImage', methods=['GET', 'PUT'])
def delete_image():
    ''' route to delete a screenshot '''
    if request.method == 'PUT':
        img_id = request.json['imgId']
        object_type = request.json['type']
        object_id = request.json['id']

        full_img_path = ''

        if object_type == 'seed':
          my_seed = db.seeds.find_one({'id': object_id})
          current_img = my_seed.get('img', [])
          try:
            current_img.remove(img_id)
            dayArr = img_id.split('-')
            year_val = dayArr[2]
            month_val = dayArr[0]
            day_val = dayArr[1]
            full_img_path = os.path.join(IMAGES_UPLOAD_FOLDER, year_val, month_val, day_val, img_id)
            os.remove(full_img_path)
            db.seeds.update_one(
              {'id': my_seed['id']},
              {"$set": {'img': current_img}}
            )
            return jsonify({'ok': True, 'type': object_type, 'id': object_id, 'img_id': img_id, 'full_img_path': full_img_path})

          except:
            return jsonify({'ok': False, 'error': "Image not found"})

        if object_type == 'overview':
          my_overview = db.overviews.find_one({'id': object_id})
          current_img = my_overview.get('img', [])
          try:
            current_img.remove(img_id)
            dayArr = img_id.split('-')
            year_val = dayArr[2]
            month_val = dayArr[0]
            day_val = dayArr[1]
            full_img_path = os.path.join(IMAGES_UPLOAD_FOLDER, year_val, month_val, day_val, img_id)
            os.remove(full_img_path)
            db.overviews.update_one(
              {'id': my_overview['id']},
              {"$set": {'img': current_img}}
            )
            return jsonify({'ok': True, 'type': object_type, 'id': object_id, 'img_id': img_id, 'full_img_path': full_img_path})

          except:
            return jsonify({'ok': False, 'error': "Image not found"})

        if object_type == 'trade':
          my_trade = db.trades.find_one({'id': object_id})
          current_img = my_trade.get('img', [])
          try:
            current_img.remove(img_id)
            dayArr = img_id.split('-')
            my_timestamp = dayArr[1]
            my_date = datetime.fromtimestamp(int(my_timestamp))
            my_year = str(my_date.year)
            my_month = str(my_date.month)
            if len(str(my_month)) == 1:
              my_month = '0' + str(my_month)
            my_day = str(my_date.day)
            if len(str(my_date.day)) == 1:
              my_day = '0' + str(my_day)
            full_img_path = os.path.join(IMAGES_UPLOAD_FOLDER, my_year, my_month, my_day, img_id)
            os.remove(full_img_path)
            db.trades.update_one(
              {'id': my_trade['id']},
              {"$set": {'img': current_img}}
            )
            return jsonify({'ok': True, 'type': object_type, 'id': object_id, 'img_id': img_id, 'full_img_path': full_img_path})

          except:
            return jsonify({'ok': False, 'error': "Image not found"})

@application.route('/strategy', methods=['GET'])
def get_strategy_stats():
    if request.method == 'GET':
        if request.args:
            strategy = request.args['strategy']
            account = request.args['account']
            # get last 200 trades (10 sets) corresponding to a chosen strategy
            sets = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account}}, {'$sort': {'timestamp': 1}}, {'$limit': 200}])
            return_sets = list(sets)

            avg_r = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account}}, {'$group': {'_id': "$strategy", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" }}}])
            return_avg_r = list(avg_r)

            big_losers = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account, "r": {'$lt': -1}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
            return_big_losers = list(big_losers)

            losers = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account, "r": {'$lt': 0, '$gte': -1}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
            return_losers = list(losers)

            winners = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account, "r": {'$lt': 2, '$gte': 0}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
            return_winners = list(winners)

            big_winners = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account, "r": {'$gt': 2}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
            return_big_winners = list(big_winners)

            total_trades = db.trades.aggregate([{'$match': {"strategy": strategy, "account": account}}, { '$group': { '_id': '$account', 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
            return_total_trades = list(total_trades)

            return jsonify({
              'ok': True,
              'sets': return_sets,
              'avg_r': return_avg_r,
              'big_losers': return_big_losers,
              'losers': return_losers,
              'winners': return_winners,
              'big_winners': return_big_winners,
              'total_trades': return_total_trades
            })

@application.route('/statistics', methods=['GET'])
def get_statistics():
    startTimestamp = int(request.args['start'])
    endTimestamp = int(request.args['end'])

    pnl_per_day = db.overviews.aggregate([{'$match': {"timestamp": {'$gte': startTimestamp, '$lte': endTimestamp}}}, {'$sort': {'timestamp': 1}}])
    return_pnl_per_day = list(pnl_per_day)

    big_losers = db.trades.aggregate([{'$match': {"timestamp": {'$gte': startTimestamp, '$lte': endTimestamp}, "r": {'$lt': -1}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
    return_big_losers = list(big_losers)

    losers = db.trades.aggregate([{'$match': {"timestamp": {'$gte': startTimestamp, '$lte': endTimestamp}, "r": {'$lt': 0, '$gte': -1}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
    return_losers = list(losers)

    winners = db.trades.aggregate([{'$match': {"timestamp": {'$gte': startTimestamp, '$lte': endTimestamp}, "r": {'$lt': 2, '$gte': 0}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
    return_winners = list(winners)

    big_winners = db.trades.aggregate([{'$match': {"timestamp": {'$gte': startTimestamp, '$lte': endTimestamp}, "r": {'$gt': 2}}}, { '$group': { '_id': "$account", 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
    return_big_winners = list(big_winners)

    total_trades = db.trades.aggregate([{'$match': {"timestamp": {'$gte': startTimestamp, '$lte': endTimestamp}}}, { '$group': { '_id': '$account', 'count': { '$sum': 1 }, 'avg_r': { '$avg': "$r" } } }])
    return_total_trades = list(total_trades)

    return jsonify({
      'ok': True,
      'pnl_per_day': return_pnl_per_day,
      'big_losers': return_big_losers,
      'losers': return_losers,
      'winners': return_winners,
      'big_winners': return_big_winners,
      'total_trades': return_total_trades
      })


if __name__ == "__main__":
    ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT,
                    debug=ENVIRONMENT_DEBUG)
