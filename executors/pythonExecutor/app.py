#!/usr/bin/env python
import pika
import os
import json
import sys
import traceback
import StringIO
import sys

QUEUE = "exec_python"

host = os.environ['RABBITMQ_HOST'] if 'RABBITMQ_HOST' in os.environ else 'localhost'

connection = pika.BlockingConnection(pika.ConnectionParameters(host))
channel = connection.channel()
print("Connected to %s" % host)

def runCode(code):
	org = sys.stdout
	try:
		out = StringIO.StringIO()
		sys.stdout = out
		exec(code)
		return {
			'success': True,
			'result': out.getvalue().split("\n")
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

def onMessage(ch, method, properties, body):
	jsonBody = json.loads(body)
	print('[x] Received %r' % jsonBody)
	message = runCode(jsonBody['code'])

	channel.basic_publish(
		exchange='',
		routing_key=properties.reply_to,
		properties=pika.BasicProperties(correlation_id = properties.correlation_id),
		body=json.dumps(message))


channel.queue_declare(queue=QUEUE)
channel.basic_consume(onMessage, queue=QUEUE, no_ack=True)
print('[*] Waiting for messages on %s' % QUEUE)
channel.start_consuming()

