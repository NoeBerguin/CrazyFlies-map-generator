//
//  socket.cpp
//
//  Created by Johnathan Chiu on 2/21/19.
//  Copyright © 2019 Johnathan Chiu. All rights reserved.
//

#include "socket.h"

#include <sys/socket.h>
#include <unistd.h>

#define PORT "5800"
#define IP "0.0.0.0"

using namespace std;
using namespace serversock;

int serversock::createConnection() {
   /* Create a socket point */
   int connSuccess = -1;
   int sockfd;
   while (connSuccess < 0) {
      struct sockaddr_in servAddr;
      sockfd = socket(AF_INET, SOCK_STREAM, 0);

      if (sockfd < 0) {
         perror("ERROR opening socket");
         exit(1);
      } else if (sockfd > 0) {
         cout << "SOCKET OPENED" << endl;
      }

      servAddr.sin_family = AF_INET;
      servAddr.sin_port = htons(atoi(PORT));
      inet_pton(AF_INET, IP, &(servAddr.sin_addr.s_addr));

      cout << "attempting to connect to server" << endl;

      connSuccess =
          connect(sockfd, (struct sockaddr *)&servAddr, sizeof(servAddr));

      if (connSuccess < 0) {
         cout << "ERROR connecting to server retrying in 5 seconds" << endl;
         sleep(5);
      } else {
         cout << "connection successful: " << sockfd << endl;
      }
   }
   return sockfd;
}

static inline bool isMemberOfType(int type) {
   return type == INVALID_TYPE || type == COMMAND_TYPE;
}

int serversock::readType(int sockfd, int expectedType) {
   char buffer[4];
   fd_set fds;
   int size;
   struct timeval tv;
   tv.tv_sec = 0;
   tv.tv_usec = 0;

   FD_ZERO(&fds);
   FD_SET(sockfd, &fds);
   select(sockfd + 1, &fds, NULL, NULL, &tv);

   if (FD_ISSET(sockfd, &fds)) {
      /* The socket_fd has data available to be read */
      size = recv(sockfd, buffer, sizeof(buffer), MSG_PEEK);

      if (size != sizeof(int)) {
         recv(sockfd, buffer, sizeof(buffer), 0);
         return INVALID_TYPE;
      }

      int type = *((int *)buffer);

      if (type == expectedType) {
         recv(sockfd, buffer, sizeof(buffer), 0);
         return type;
      }
      if (!isMemberOfType(type)) {
         recv(sockfd, buffer, sizeof(buffer), 0);
      }
   }

   return INVALID_TYPE;
}

bool isMemberOfCommand(int command) {
   return command == INVALID_COMMAND || command == START_COMMAND ||
          command == STOP_COMMAND || command == RETURN_TO_BASE_COMMAND;
}

bool serversock::readCommand(int sockfd, void *data) {
   int size;
   /* The socket_fd has data available to be read */
   int type = readType(sockfd, COMMAND_TYPE);
   if (type == COMMAND_TYPE) {
      char buffer[sizeof(int)];
      size = recv(sockfd, buffer, sizeof(buffer), 0);

      if (size != sizeof(int)) {
         return false;
      }

      int command = *((int *)buffer);

      if (isMemberOfCommand(command)) *(int *)data = command;

      return true;
   }

   return false;
}

void serversock::sendInfo(struct DroneInfo state, int sockfd) {
   fd_set fds;
   struct timeval tv;
   tv.tv_sec = 0;
   tv.tv_usec = 0;

   FD_ZERO(&fds);
   FD_SET(sockfd, &fds);
   select(sockfd + 1, &fds, NULL, NULL, &tv);
   send(sockfd, &state, sizeof(state), 0);
}
