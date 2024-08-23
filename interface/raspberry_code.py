from machine import I2C, Pin
import time
#import seaborn as sns
#import matplotlib.pyplot as plt

# Direcciones de los dispositivos MPU6050
MPU6050_ADDR_1 = 0x68
MPU6050_ADDR_2 = 0x69

# Registros de salida del acelerómetro para el eje X
ACCEL_XOUT_H = 0x3B

# Configuración de los pines SDA y SCL
i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000) # SCL en GP5 y SDA en GP4

# Función para leer datos del acelerómetro
def read_raw_data(addr):
    high = i2c.readfrom_mem(addr, ACCEL_XOUT_H, 1)[0]
    low = i2c.readfrom_mem(addr, ACCEL_XOUT_H+1, 1)[0]
    value = (high << 8) + low
    if value > 32768:
        value = value - 65536
    return value
def start_study():
    try:
        # Listas para almacenar datos
        data_1 = []
        data_2 = []

        # Lectura de datos durante 10 segundos
        start_time = time.time()
        while time.time() - start_time < 10:
            # Lectura de datos del eje X para ambos acelerómetros
            acc_x_1 = read_raw_data(MPU6050_ADDR_1)
            acc_x_2 = read_raw_data(MPU6050_ADDR_2)

            # Agregar datos a las listas
            data_1.append(acc_x_1)
            data_2.append(acc_x_2)
            
            #time.sleep(0.1)  # Pausa de 0.1 segundos entre lecturas

        return         
    except KeyboardInterrupt:
        pass