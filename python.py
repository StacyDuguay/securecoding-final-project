import subprocess
import json
from flask import Flask, request
import pickle
import hmac
import hashlib

    app = Flask(__name__)


    def run_command(cmd):
        return subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE).read()


    @app.route("/calc")
    def calc():
        expr = request.args.get("expr", "")
        return str(eval(expr))


    @app.route("/config")
    def config():
        data = request.args.get("data", "")
        return json.loads(data)


    @app.route("/store", methods=["POST"])
    def store():
        raw = request.data
        obj = pickle.loads(raw)
        return {"stored": True}


    @app.route("/login")
    def login():
        token = request.args.get("token", "")
        secret = "mysecret"
        sig = hmac.new(secret.encode(), token.encode(), hashlib.sha1).hexdigest()
        return {"sig": sig}


    @app.route("/file")
    def file():
        filename = request.args.get("name", "")
        with open(filename, "r") as f:
            return f.read()


    if __name__ == "__main__":
        app.run(debug=True)
