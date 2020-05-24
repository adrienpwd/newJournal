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

from config import Config

import csv
import io
import pprint
import shutil
import json

application = Flask(__name__)
application.config.from_object(Config)


application.config["MONGO_URI"] = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + \
    os.environ['MONGODB_PASSWORD'] + '@' + os.environ['MONGODB_HOSTNAME'] + \
    ':27017/' + os.environ['MONGODB_DATABASE']

# application.config["MONGO_URI"] = 'mongodb://' + 'userJournal' + ':' + \
#    'ayqgqc2h2o' + '@' + "192.168.1.72" + \
#    ':27017/' + 'journal'

mongo = PyMongo(application)
db = mongo.db
cors = CORS()

cors.init_app(application, resources={r"*": {"origins": "*"}})

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

    order = {
        'account': row[2],
        'order_id': row[0],
        'route': row[4],
        'type': row[7],
        'short': is_short,
        'is_stop': is_stop,
        'market_type': row[9],
        'ticker': row[11],
        'qty': int(row[12]),
        'price': float(row[14]),
        'time': time
    }

    if is_stop:
        order['stop_price'] = float(row[15])
        order['trail_price'] = float(row[16])

    return order


def init_trade(row, order):
    order_id = row[1]
    price = float(row[13])
    time = format_date(row[14])
    timestamp = get_timestamp(row[14])
    is_short = row[9] == 'Y'

    # id that we use for a trade
    id = row[11] + "-" + str(int(timestamp))

    return {
        'id': id,
        'account': row[3],
        'trader': row[2],
        'ticker': row[11],
        'time': time,
        'qty': int(row[12]),
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
        'catalysts': [],
        'rvol': 0,
        'rating': 0
    }


def build_order(data):
    with open(data, 'r', encoding='utf8') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        next(csvreader, None)  # skip the headers
        temp_orders = {}

        for row in csvreader:
            temp_orders[row[0]] = init_order(row)

    return temp_orders


def get_duration(entry_time, exit_time):
    datetime_a = datetime.strptime(entry_time, DATE_FORMAT_OUTPUT)
    datetime_b = datetime.strptime(exit_time, DATE_FORMAT_OUTPUT)
    return datetime_b - datetime_a


def get_action_type(order, trade_type):
    action_type = ''
    if trade_type == 'B':
        if order['type'] == 'B' and order['is_stop'] == False:
            action_type = 'Buy'
        elif order['type'] == 'S' and order['is_stop'] == False and order.get('init_price'):
            action_type = 'Sell'
        elif order['type'] == 'S' and order['market_type'] == 'Lmt' and order['is_stop'] == True:
            action_type = 'Set Limit (Long)'
        elif order['type'] == 'S' and order['market_type'] == 'Mkt' and order['is_stop'] == True:
            action_type = 'Set Stop (Long)'
        elif order['type'] == 'S' and order['market_type'] == 'Lmt' and order['is_stop'] == False:
            action_type = '???'
    if trade_type == 'S':
        # TODO: implement SHORT actions
        if order['type'] == 'S' and order['is_stop'] == False:
            action_type = 'Short'
        elif order['type'] == 'B' and order['is_stop'] == False and order.get('init_price'):
            action_type = 'Cover'
        elif order['type'] == 'B' and order['market_type'] == 'Lmt' and order['is_stop'] == True:
            action_type = 'Set Limit (Short)'
        elif order['type'] == 'B' and order['market_type'] == 'Mkt' and order['is_stop'] == True:
            action_type = 'Set Stop (Short)'
        elif order['type'] == 'B' and order['market_type'] == 'Lmt' and order['is_stop'] == False:
            action_type = '???'
    return action_type


def get_gain(trade):
    gain = 0
    buy = 0
    sell = 0

    for action in trade['actions']:
        if action.get('action_type') == 'Buy':
            buy += action.get('init_price') * action.get('qty')

        if action.get('action_type') == 'Sell':
            sell += action.get('init_price') * action.get('qty')

     # Long
    if trade.get('type') == 'B':
        gain = sell - buy

    # Short
    if trade.get('type') == 'S':
        gain = buy - sell

    return round(gain, 2)


def get_slippage(trade):
    slippage = 0

    # Long
    if trade.get('type') == 'B':
        for action in trade['actions']:
            if action.get('action_type') == 'Buy' or action.get('action_type') == 'Sell':
                slippage += (action.get('price') -
                             action.get('init_price')) * action.get('qty')

    # TODO: implement this
    # Short
    # if trade.get('type') == 'S':
        # if action.get('action_type') == 'Short':
            # slippage += (action.get('init_price') - action.get('price')) * action.get('qty')

    return round(slippage, 2)


def consolidate_trade(all_trades, built_trades, orders_dictionary):
    if len(all_trades) == 0:
        return built_trades

    initial_trade = all_trades[0]
    initial_trade['strategy'] = ""
    initial_trade['description'] = ""
    initial_trade['actions'] = []

    # Remove first trade of the list, since it's the main one,
    # we don't want to have it here
    all_trades.pop(0)

    init_size = initial_trade.get('qty')

    entry_time = initial_trade['time']
    trade_entry_time = datetime.strptime(
        entry_time, '%d/%m/%Y %H:%M:%S').timestamp()

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

        # remove processed trade
        all_trades.pop(0)

        # Trade is consolidated
        if next_size == 0:
            exit_time = next_trade.get('time')
            trade_exit_time = datetime.strptime(
                exit_time, '%d/%m/%Y %H:%M:%S').timestamp()

            for order in orders_dictionary:
                my_order = orders_dictionary[order]
                if (
                    initial_trade.get('ticker') == my_order.get(
                        'ticker') and initial_trade.get('account') == my_order.get('account')
                ):
                    order_time = datetime.strptime(
                        my_order.get('time'), '%d/%m/%Y %H:%M:%S').timestamp()
                    # DAS seems to have some issue with the timestamp, in so me cases there was
                    # an order that came before the trade by 1 sec. so I use the "- 1" to allow for 1 sec. margin error
                    if trade_entry_time <= order_time <= trade_exit_time or trade_entry_time - 1 <= order_time <= trade_exit_time:
                        # Find action type (Buy, Sell, Stop, ...)
                        action_type = get_action_type(
                            my_order, initial_trade.get('type'))
                        my_order['action_type'] = action_type
                        initial_trade['actions'].append(my_order)

            initial_trade['actions'].sort(key=lambda t: t['time'])

            # calculate gain for this trade
            gain = get_gain(initial_trade)
            initial_trade['gain'] = gain

            # risk / reward ratio
            risk = 10
            r = round(gain / risk, 2)
            initial_trade['r'] = r

            # slippage
            initial_trade['slippage'] = get_slippage(initial_trade)

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

# @app.route('/trades/<string:id>')
# def article(year, month, title):
#    ...


@application.route('/trades', methods=['GET'])
def list_trades():
    ''' route to get all the trades '''
    if request.method == 'GET':
        data = db.trades.find()
        return_data = list(data)
        return jsonify({'ok': True, 'trades': return_data})


@application.route('/importTrades', methods=['GET', 'POST'])
def post_raw_data():
    ''' route to post raw data '''
    if request.method == 'POST':
        # Build Orders
        csv_orders = request.files['ordersInput']
        orders_stream = io.StringIO(
            csv_orders.stream.read().decode("UTF8"), newline=None)
        next(orders_stream, None)  # skip the headers
        csv_orders_input = csv.reader(orders_stream)
        orders_dictionary = {}
        orders_list = []

        for row in csv_orders_input:
            order = init_order(row)
            orders_dictionary[row[0]] = order
            orders_list.append(order)

        # Build Trades
        csv_trades = request.files['tradesInput']
        trades_stream = io.StringIO(
            csv_trades.stream.read().decode("UTF8"), newline=None)
        next(trades_stream, None)  # skip the headers
        csv_trades_input = csv.reader(trades_stream)
        trades_dictionary = {}
        trades_list = []

        for row in csv_trades_input:
            # Find corresponding order
            order_id = row[1]
            my_order = orders_dictionary[order_id]
            trade = init_trade(row, my_order)

            # When we create a trade we need to remember the original price
            # to calculate the slippage
            orders_dictionary[order_id]['init_price'] = trade['price']

            trades_list.append(trade)

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

        # if everything was ok
        # insert in DB raw data
        # mongo.db.raw_orders.insert_many(orders_list)
        # mongo.db.raw_trades.insert_many(trades_list)

        # then we build aggregated trades
        all_my_trades = []

        # Consolidate all Trades
        for user in trades_dictionary:
            for trade in trades_dictionary[user]:
                all_my_trades.extend(consolidate_trade(
                    trades_dictionary[user][trade], [], orders_dictionary))

        # all aggregated trades
        mongo.db.trades.insert_many(all_my_trades)

        return jsonify({'ok': True, 'orders': orders_list, 'trades': trades_list, 'aggregatedTrades': all_my_trades, 'trades_dictionary': trades_dictionary})


@application.route('/uploadImages', methods=['POST'])
def post_trade_images():
    if request.method == 'POST':
        timestamp = 0
        # filename should be this format
        # ticker-timestap-index
        # ex: QGEN-1574098671-1

        for trade_image in request.files:
            timestamp = request.files[trade_image].filename.split('-')[1]
        date = datetime.fromtimestamp(int(timestamp))
        year_val = str(date.year)
        month_val = str(date.month)
        day_val = str(date.day)
        date_path = os.path.join(year_val, month_val, day_val)
        base_index = 0
        image_pathes = []

        try:
            os.makedirs(os.path.join(IMAGES_UPLOAD_FOLDER, date_path))
        except FileExistsError:
            # directory already exists
            saved_images = os.listdir(os.path.join(
                IMAGES_UPLOAD_FOLDER, date_path))
            base_index = len(saved_images)

        for trade_image in request.files:
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

            mongo.db.trades.update_one(
                {'id': trade_id},
                {"$set": {
                    'img': image_pathes
                }
                }, upsert=False
            )

        return jsonify({'ok': True, 'tradeId': trade_id, 'imagePathes': image_pathes})


@application.route('/editTrade', methods=['GET', 'PUT'])
def edit_trade_data():
    ''' route to edit a trade '''
    if request.method == 'PUT':
        trade = request.json['trade']
        details = request.json['data']
        mongo.db.trades.update_one(
            {'id': trade['id']},
            {"$set": {
                'strategy': details['strategy'],
                'description': details['description'],
                'catalysts': details['catalysts'],
                'rvol': details['rvol'],
                'rating': details['rating']
            }
            }, upsert=False
        )
        return jsonify({'ok': True, 'tradeID': trade['_id'], 'strategy': details['strategy']})


@application.route('/importImages', methods=['GET'])
def send_image():
    return send_from_directory(IMAGES_UPLOAD_FOLDER + '/2020/1/10', 'LB-1578652287-0.PNG', as_attachment=True)


if __name__ == "__main__":
    ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT,
                    debug=ENVIRONMENT_DEBUG)
