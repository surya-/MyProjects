from flask import Flask, jsonify
from flask import abort
from flask import make_response
from flask import request
import mysql.connector as mysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/classroom/buildings/', methods=['GET'])
def get_buildings():
  db = mysql.connect(
    host="localhost",
    database="qbe",
    user="root",
    passwd="surya430",
    auth_plugin='mysql_native_password'
  )
  query = "select bcode,bname from BUILDING "
  cursor = db.cursor()
  cursor.execute(query)
  records = cursor.fetchall()
  bldgs = []
  for record in records:
    bldgs.append({'bldg':record[0], 'bname':record[1]})
  result = {'buildings': bldgs}
  cursor.close()
  db.close()
  return jsonify(result)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(host='localhost',debug=True)