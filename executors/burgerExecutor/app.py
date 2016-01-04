#!/usr/bin/env python3
import redis
import os
import json
import sys
import traceback
import io
from burgerExec import burgerExec
from multiprocessing import Process, Queue
from queue import Empty

QUEUE = "exec_burger"

host = os.environ[
    'REDIS_HOST'] if 'REDIS_HOST' in os.environ else 'localhost:6379'
host = host.split(':')

client = redis.StrictRedis(
    host=host[0],
    port=int(host[1])
)
p = client.pubsub()
print("Connected to %s" % ':'.join(host))


def runCode(code, q):
    org = sys.stdout
    try:
        out = io.StringIO()
        sys.stdout = out
        burgerExec(code)
        output = out.getvalue().split("\n")
        q.put({
            'success': True,
            'result': output[:-1]
        })
        return
    except:
        ex_type, ex, tb = sys.exc_info()
        stacktrace = [x[1:] for x in traceback.extract_tb(tb)[2:]]
        q.put({
            'success': False,
            'errors': [ex_type.__name__ + ': ' + str(ex)],
            'stacktrace': stacktrace
        })
    finally:
        sys.stdout = org


def onMessage(message):
    if message['type'] != 'message':
        return

    body = message['data']
    jsonBody = json.loads(body.decode('utf-8'))
    print('[x] Received %r' % jsonBody)
    q = Queue()
    p = Process(target=runCode, args=(jsonBody['content']['files']['index.py']['content'], q, ))
    p.start()
    try:
        timeout = 2
        message = q.get(True, timeout=timeout)
        p.join(timeout)
    except Empty:
        print("Process timed out")
        p.terminate()
        message = {
            'success': False,
            'errors': ['Timeout']
        }

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
