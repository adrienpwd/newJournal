# TOTAL (ALL TIME)
# db.trades.aggregate({$group: {_id: "$account", total: {$sum: "$gain"}}})

# TOTAL (DAY)
# db.trades.find({"timestamp": {"$gte": startTimestamp, "$lte": endTimestamp}})
#db.trades.aggregate({'$project': {'year': {'$year': '$timestamp'},'month': {'$month': '$timestamp'},'dayOfMonth': {'$dayOfMonth': '$timestamp'}}},{'$group': {'_id': {'year': '$year','month': '$month','dayOfMonth': '$dayOfMonth'},'count': {'$sum': 1}}})
