# Created By: Daniel Myerscough, Kaho Wentzel, Ryan Abernethy and Jasmine Kaur
# Created On: 09-22-2023
#    Purpose: IFT 402 Captstone Project
#             This program is designed to log temperature data from the Raspberry Pi  
#             and write it to a MySQL database.
#             Program will also send out an email alert if the temperature is out of range.
#             This program will be run on a Raspberry Pi 4+ with a SenseHat.
#             This device will be on the client side, meaning the database information will be known. 
#
#  Functions: db_connect() - Connects to the database
#             get_devices() - Get all the devices associated with the client, will also want to grab the min and max temp for each device.
#							- However, will this script run on each device individually or on a bridge for all devices?
#             get_temp() - Gets the temperature from the sensor
#             check_temp() - Checks the temperature against the range
#             write_temp() - Writes the temperature to the database
#             notify_user() - Sends an email alert if the temperature is out of range
#			  execute_query() - Executes a mysql query that is passed in. Returns the results. 
#
#  Dependencies: mysql.connector, sense_hat
#
# Imports and global variables:
try:
    import logging
    import datetime
    import time
    import random # For testing
    import sys
    import os
    from inspect import currentframe
    from sense_hat import SenseHat
    import mysql.connector as mysql
    if not os.path.exists('./temperature_logger.log'):
        os.mknod('./temperature_logger.log')
    logging.basicConfig(filename='temperature_logger.log', level=logging.INFO)
    global test_mode
    global database
    global conv_celsius
    test_mode = False
    conv_celsius = True
    database = "tbd_dam" # this will be the client code from our users / clients table.
    dev_id = "02rbapi" # This script will run on 1 device, so this will be hard-coded.
    class Device:
        def __init__(self):
            self.id = "Zero"
            self.max_temp = 1000
            self.min_temp = -1000
            self.alert_bool = 0
            self.alert_user = ""

except Exception as e:
    t = datetime.datetime.now()
    l = currentframe().f_lineno
    m = str(t) + " | Error, line " + str(l)
    logging.error(m + " | Unable to import modules.")
    logging.info(type(e))
    logging.info(e)

# Functions
def db_connect():
    try:
        dvc = mysql.connect(
            host = "98.226.164.218", # Host will be identical for each instance of this script.
            user="", # Username and password would be hard-coded in?
            password="",
            port=33060)
    except Exception as e:
        t = datetime.datetime.now()
        l = currentframe().f_lineno
        m = str(t) + " | Error, line " + str(l)
        logging.error(m + " | Unable to connect to the database.")
        logging.info(type(e))
        logging.info(e)
        if not test_mode:
            sys.exit()
    return dvc

def get_devices(db):
    sql = "SELECT max_temp, min_temp, alert_bool, alert_user FROM " + database + ".devices WHERE deleted_at IS NULL AND serial_num = \"" + dev_id + "\";"
    result = execute_query(db, sql)
    device = Device()
    device.id = dev_id
    device.max_temp = result[0][0]
    device.min_temp = result[0][1]
    device.alert_bool = result[0][2]
    device.alert_user = result[0][3]
    return device

def get_temp(sense):
    temp = round(sense.temperature,1)
    if conv_celsius:
        temp = round(((9/5)*temp + 32),1)
    return temp

def write_temp(temp, device, db):
    t = datetime.datetime.now()
    sql = "INSERT INTO " + database + ".logs (logged_at, logged_temp, device_id, is_F) VALUES (%s, %s, %s, %s);"
    values = (t, temp, device, conv_celsius)
    if not test_mode:
        execute_query(db, sql, values)
    logging.info("Temperature Measured: " + str(temp) + " on " + str(device) + " at " + str(t))
    return

def check_temp(temp, sensor, dev_db):
    if temp > sensor.max_temp or temp < sensor.min_temp:
        t = datetime.datetime.now()
        logging.info("Temperature out of range at " + str(t))
        if sensor.alert_bool == 1:
            notify_user(temp, sensor, dev_db)
    return

def notify_user(temp, sensor, dev_db):
    t = datetime.datetime.now()
    try:
        sql = "SELECT email FROM app_users.users WHERE user_id = " + sensor.alert_user + ";"
        user_email = execute_query(dev_db, sql)
        user_email = user_email[0][0]
        # logging.handlers.SMTPHandler() for emails?
        logging.info("Temp out of range, Email sent to: " + user_email)
    except TypeError:
        logging.info("Temp out of range, no alert user set")
    return

def execute_query(db, sql, values=None):
    if not test_mode:
        try:
            mycursor = db.cursor()
            if values == None:
                mycursor.execute(sql)
            else:
                mycursor.execute(sql, values)
            myresult = mycursor.fetchall()
            db.commit()
        except Exception as e: 
            t = datetime.datetime.now()
            l = currentframe().f_lineno
            m = str(t) + " | Error, line " + str(l)
            logging.error(m + " | Unable to query database.")
            logging.info("Statement: " + str(sql))
            logging.info(type(e))
            logging.info(e)
            db.close()
            sys.exit()
        return myresult
    else:
        result = "Test mode, no query executed."
        return result

def color_burst(sense):
    i = 0
    while i < 10:
        sense = SenseHat()
        a = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        b = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        c = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        d = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        e = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        f = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        g = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        h = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        j = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        k = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        l = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        m = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        n = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        o = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        p = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        q = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        r = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        s = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        t = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        u = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        v = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        w = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        x = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        y = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        z = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
        target = [
        a, b, c, d, e, f, g, h,
        d, j, k, l, m, n, o, p,
        q, r, s, t, w, x, y, z,
        k, l, a, t, x, y, v, q,
        g, e, v, z, p, e, w, a,
        v, o, w, p, q, b, l, s, 
        u, o, p, a, x, l, r, b, 
        e, j, k, y, s, a, e, p
        ]
        sense.set_pixels(target)
        time.sleep(0.1)
        i = i + 1

    return

# Main control loop
try:
    dev_db = db_connect()
    sensor = get_devices(dev_db)
    sense = SenseHat()
    sense.set_rotation(180)
    t = datetime.datetime.now()
    logging.info("====== New Script Started ======")
    logging.info(str(t))

    while True:
        try:
            logging.info("====== Waking up ======")
            color_burst(sense)
            temp = get_temp(sense)
            write_temp(temp, sensor.id, dev_db)
            temp_in_range = check_temp(temp, sensor, dev_db)
            col = (random.randint(0,255),random.randint(0,255),random.randint(0,255))
            sense.show_message(str(temp),text_colour=col)
            color_burst(sense)
            sleep_time = 20
            logging.info("====== Sleeping for " + str(sleep_time) + " minutes ======")
            time.sleep(sleep_time*60) # Sleep will be set to 15 minutes or something
            if test_mode: # Break out of the loop after one iteration while testing
                logging.info("====== Run completed successfully ======")
                dev_db.close()
                break
        execpt Exception as e:
            logging.info("====== Run failed mid-cycle ======")
            t = datetime.datetime.now()
            l = currentframe().f_lineno
            m = str(t) + " | Error, line " + str(l)
            logging.error(m + " | Error during cycle, restart python script on Pi")
            logging.info(type(e))
            logging.info(e) 
            dev_db.close()
            sys.exit()

except Exception as e:
    logging.info("====== Run failed to start ======")
    t = datetime.datetime.now()
    l = currentframe().f_lineno
    m = str(t) + " | Error, line " + str(l)
    logging.error(m + " | Unable to run main control loop.")
    logging.info(type(e))
    logging.info(e)
    dev_db.close()
    sys.exit()
