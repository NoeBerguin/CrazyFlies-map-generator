FROM python:3.9

RUN apt-get update && apt-get install -y \
	usbutils \
	udev \
    sdcc 

WORKDIR /root/server
COPY run.py ./
COPY ./app ./app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

#install cflib
RUN cd /root/ &&\
    git clone https://github.com/bitcraze/crazyflie-lib-python.git &&\
    cd crazyflie-lib-python &&\
    pip install -r requirements.txt &&\
    pip install -r requirements-dev.txt &&\
    pip install -e .

ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_APP=run.py
ENV FLASK_ENV=development
ENV PORT=4800

EXPOSE 4800
EXPOSE 5800

CMD ["python3", "run.py"]

RUN mkdir  -p /etc/udev/rules.d

RUN echo '# Crazyradio (normal operation) \
          SUBSYSTEM=="usb", ATTRS{idVendor}=="1915", ATTRS{idProduct}=="7777", MODE="0664", GROUP="plugdev" \
          # Bootloader \
          SUBSYSTEM=="usb", ATTRS{idVendor}=="1915", ATTRS{idProduct}=="0101", MODE="0664", GROUP="plugdev" \
          SUBSYSTEM=="usb", ATTRS{idVendor}=="0483", ATTRS{idProduct}=="5740", MODE="0664", GROUP="plugdev" ' > /etc/udev/rules.d/99-crazyradio.rules