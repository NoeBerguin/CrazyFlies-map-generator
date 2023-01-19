//
//  socket.hpp
//
//  Created by Johnathan Chiu on 2/21/19.
//  Copyright © 2019 Johnathan Chiu. All rights reserved.
//

#ifndef socket_h
#define socket_h

#include <arpa/inet.h>
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>

#include <cstring>
#include <iostream>

#include "sensors_info.h"

enum Commands {
   INVALID_COMMAND = -1,
   START_COMMAND = 5,
   STOP_COMMAND = 6,
   RETURN_TO_BASE_COMMAND = 3,
   EXPLORE_COMMAND = 7
};

enum DataType { INVALID_TYPE = -1, COMMAND_TYPE = 0};

namespace serversock {

int createConnection();
int readType(int sockfd, int expected_type);
bool readCommand(int sockfd, void *data);
void sendInfo(struct DroneInfo state, int sockfd);

}  // namespace serversock

#endif /* socket_hpp */
