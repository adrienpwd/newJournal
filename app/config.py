import os


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'my_secret_key'
    # must specify retryWrites=alse in connection string !
    MONGO_URI = os.environ.get(
        'MONGO_URL') or 'mongodb://adrien:ayqgqc2h2o@ds335668.mlab.com:35668/tradeslog?retryWrites=false'
    IMAGES_UPLOAD_FOLDER = '/tradeLogs'
    # Date format for DAS Trader csv files
    DATE_FORMAT_INPUT = '%m/%d/%y %H:%M:%S'
    DATE_FORMAT_OUTPUT = '%m/%d/%Y %H:%M:%S'
    # Structure for creating folders from date (2019/12/11 => 2019 > 12 > 11)
    FOLDER_DATE_STRUCTURE = '%Y%m%d'
