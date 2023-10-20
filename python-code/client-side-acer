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
#  Dependencies: mysql.connector, 
#
# Imports and global variables:
try:
    import logging
    import datetime
    import time
    import random # For testing
    import sys
    import os
    import csv
    from inspect import currentframe
    import mysql.connector as mysql
    if not os.path.exists('./temperature_logger.log'):
        os.mknod('./temperature_logger.log')
    logging.basicConfig(filename='temperature_logger.log', level=logging.INFO)
    global test_mode
    global database
    global conv_celsius
    test_mode = True
    conv_celsius = False
    database = "tbd_dam" # this will be the client code from our users / clients table.
    dev_id = "01dampi" # This script will run on 1 device, so this will be hard-coded.
    class Device:
        def __init__(self):
            self.id = "Zero"
            self.max_temp = 1000
            self.min_temp = -1000
            self.alert_bool = False
            self.alert_user = ""
            self.sleep_time = 1800

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
            user="dmyerscough", # Username and password would be hard-coded in?
            password="password",
            port=33060 )
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
    sql = "SELECT serial_num, max_temp, min_temp, alert_bool, alert_user, temp_frequency FROM " + database + ".devices WHERE deleted_at IS NULL AND model_name LIKE 'Acer%';"
    result = execute_query(db, sql)
    devices = []
    for dev in result:
        device = Device()
        device.id = dev[0]
        device.max_temp = dev[1]
        device.min_temp = dev[2]
        device.alert_bool = dev[3]
        device.alert_user = dev[4]
        device.sleep_time = dev[5]
        devices.append(device)
    return devices

def get_temp(col):
    dt = datetime.datetime.now()
    date = dt.strftime("%Y%m%d")
    fname = r"C:\Users\dmyerscough\OneDrive - Wilber and Associates\Desktop\coding_playground\Python_Files\SFLog" + str(date) + ".csv"
    with open(fname, newline='') as f:
        reader = csv.reader(f, delimiter=',', quoting=csv.QUOTE_NONE)
        last_line = list(reader)[-1]
        tm = last_line[0]
        d = datetime.datetime.combine(dt.date(), datetime.time.min)
        d = d + datetime.timedelta(seconds=int(tm))
        temp = last_line[col]
    if conv_celsius:
        temp = round(((9/5)*float(temp) + 32),1)
    return temp

def write_temp(temp, device, db, conv_celcius=False):
    t = datetime.datetime.now()
    sql = "INSERT INTO " + database + ".logs (logged_at, logged_temp, device_id, is_F) VALUES (%s, %s, %s, %s);"
    values = (t, temp, device, conv_celsius)
    # if not test_mode:
    execute_query(db, sql, values)
    logging.info("Temperature Measured: " + str(temp) + " on " + str(device) + " at " + str(t))
    return

def check_temp(temp, sensor, dev_db):
    max_temp = float(sensor.max_temp)
    min_temp = float(sensor.min_temp)
    if temp > max_temp or temp < min_temp:
        t = datetime.datetime.now()
        logging.info("Temperature out of range at " + str(t))
        if sensor.alert_user != "":
            notify_user(temp, sensor, dev_db)
    return

def notify_user(temp, sensor, dev_db):
    t = datetime.datetime.now()
    sql = "SELECT email FROM app_users.users WHERE user_id = " + sensor.alert_user + ";"
    user_email = execute_query(dev_db, sql)
    user_email = user_email[0][0]
    # logging.handlers.SMTPHandler() for emails?
    logging.info("Temp out of range, Email sent to: " + user_email)
    return

def execute_query(db, sql, values=None):
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

# Main control loop
try:
    dev_db = db_connect()
    devices = get_devices(dev_db)
    print(devices)
    t = datetime.datetime.now()
    logging.info("====== New Script Started ======")
    logging.info(str(t))

    while True:
        i = 0
        logging.info("====== Waking up ======")
        for sensor in devices:
            print("Checking " + str(i))
            logging.info("Checking sensor " + str(sensor.id))
            i += 1
            temp = get_temp(i)
            print(temp)
            temp = float(temp)
            write_temp(temp, sensor.id, dev_db, conv_celsius)
            temp_in_range = check_temp(temp, sensor, dev_db)
            sleep_time = sensor.sleep_time

        logging.info("====== Sleeping for " + str(sleep_time/60) + " minutes ======")
        time.sleep(sleep_time) # Sleep will be set to 15 minutes or something
        if test_mode: # Break out of the loop after one iteration while testing
            logging.info("====== Run completed successfully ======")
            dev_db.close()
            break 

except Exception as e:
    t = datetime.datetime.now()
    l = currentframe().f_lineno
    m = str(t) + " | Error, line " + str(l)
    logging.error(m + " | Unable to run main control loop.")
    logging.info(type(e))
    logging.info(e)
    dev_db.close()
    sys.exit()
