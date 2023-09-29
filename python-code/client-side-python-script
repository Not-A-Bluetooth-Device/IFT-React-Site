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
    test_mode = True
    conv_celsius = True
    database = "dam" # this will be the client code from our users / clients table.
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
            host = "", # Host will be identical for each instance of this script.
            user="", # Username and password would be hard-coded in?
            password="") # Database is populated as a global variable on line 32, this will be the client specific database.
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
    if not test_mode:
        sql = "SELECT id FROM " + database + ".devices WHERE deleted_at IS NULL;"
        result = execute_query(db, sql)
        return [row[0] for row in result]
    else:
        result = ["device-1", "device-2", "device-3"]
        return result

def get_temp(sense):
    temp = round(sense.temperature,1)
    if conv_celsius:
        temp = round(((9/5)*temp + 32),1)
    return temp

def write_temp(temp, device, db):
    t = datetime.datetime.now()
    sql = "INSERT INTO " + database + ".log (device, temperature, created_at) VALUES (%s, %s, %s);"
    values = (device, temp, t)
    if not test_mode:
        execute_query(db, sql, values)
    logging.info("Temperature Measured: " + str(temp) + " on " + str(device) + " at " + str(t))
    return

def check_temp(temp):
    d = random.choice([True, False])
    logging.info("Temperature is in range: " + str(d))
    # for production: Devices will be passed in, or list of min / max temperatures will be passed in to compare against.
    return d

def notify_user(temp, sensor):
    t = datetime.datetime.now()
    # Send email or phone alert to user?
    logging.info("Temp out of range, Email sent at: " + str(t))
    return

def execute_query(db, sql, values=None):
    try:
        mycursor = db.cursor()
        if values == None:
            mycursor.execute(sql)
        else:
            mycursor.execute(sql, values)
        myresult = mycursor.fetchall()
        # db.commit() Not doing this on the Wilber server
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

# Main control loop
try:
    # dev_db = db_connect()
    dev_db = ""
    devices = get_devices(dev_db)
    sense = SenseHat()
    t = datetime.datetime.now()
    logging.info("====== New Script Started ======")
    logging.info(str(t))

    while True:
        logging.info("====== Waking up ======")
        for sensor in devices:
            temp = get_temp(sense)
            write_temp(temp, sensor, dev_db)
            temp_in_range = check_temp(temp)
            if not temp_in_range:
                notify_user(temp, sensor)
        logging.info("====== Sleeping for 15 minutes ======")
        time.sleep(1) # Sleep will be set to 15 minutes or something
        if test_mode: # Break out of the loop after one iteration while testing
            logging.info("====== Run completed successfully ======")
            # dev_db.close()
            break 
except Exception as e:
    t = datetime.datetime.now()
    l = currentframe().f_lineno
    m = str(t) + " | Error, line " + str(l)
    logging.error(m + " | Unable to run main control loop.")
    logging.info(type(e))
    logging.info(e)
    err1 = "Main Control Loop"
    err2 = "Program aborted, restart on bridge."
    notify_user(err1, err2)
    # dev_db.close()
    sys.exit()
