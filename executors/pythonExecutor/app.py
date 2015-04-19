#!/usr/bin/env python
import redis
import os
import json
import sys
import traceback
import StringIO
import sys

QUEUE = "exec_python"

host = os.environ[
    'REDIS_HOST'] if 'REDIS_HOST' in os.environ else 'localhost:6379'

client = redis.StrictRedis(
    host=host.split(':')[0],
    port=int(host.split(':')[1])
)
p = client.pubsub()
print("Connected to %s" % host)


def runCode(code):
    org = sys.stdout
    try:
        out = StringIO.StringIO()
        sys.stdout = out
        exec(code)
        return {
            'success': True,
            'result': out.getvalue().split("\n")[:-1]
        }
    except:
        ex_type, ex, tb = sys.exc_info()
        return {
            'success': False,
            'errors': [str(ex)],
            'stacktrace': map(lambda x: x[1:], traceback.extract_tb(tb)[1:])
        }
    finally:
        sys.stdout = org


def onMessage(message):
    if message['type'] != 'message':
        return

    body = message['data']
    jsonBody = json.loads(body)
    print('[x] Received %r' % jsonBody)
    message = runCode(jsonBody['content']['code'])

    client.publish(
        jsonBody['properties']['replyTo'],
        json.dumps({
            'content': message,
            'properties': {
                'correlationId': jsonBody['properties']['correlationId']
            }
        })
    )

p.subscribe(QUEUE)
print('[*] Waiting for messages on %s' % QUEUE)
for message in p.listen():
    onMessage(message)
