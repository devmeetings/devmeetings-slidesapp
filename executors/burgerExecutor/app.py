#!/usr/bin/env python3
import pika
import os
import json
import sys
import traceback
import io
from burgerExec import burgerExec
from multiprocessing import Process, Queue
from queue import Empty

QUEUE = "exec_burger"

host = os.environ['RABBITMQ_HOST'] if 'RABBITMQ_HOST' in os.environ else 'localhost'

connection = pika.BlockingConnection(pika.ConnectionParameters(host))
channel = connection.channel()
print("Connected to %s" % host)


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
        stacktrace = [x[1:] for x in traceback.extract_tb(tb)[1:]]
        q.put({
            'success': False,
            'errors': [str(ex)],
            'stacktrace': stacktrace
        })
    finally:
        sys.stdout = org


def onMessage(ch, method, properties, body):
    jsonBody = json.loads(body.decode('utf-8'))
    print('[x] Received %r' % jsonBody)
    q = Queue()
    p = Process(target=runCode, args=(jsonBody['code'], q, ))
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

    channel.basic_publish(
        exchange='',
        routing_key=properties.reply_to,
        properties=pika.BasicProperties(correlation_id = properties.correlation_id),
        body=json.dumps(message))


channel.queue_declare(queue=QUEUE)
channel.basic_consume(onMessage, queue=QUEUE, no_ack=True)
print('[*] Waiting for messages on %s' % QUEUE)
channel.start_consuming()
