#include "communication.h"
#include "stateController.h"

int lookForPackage() {
   int command = NO_PACKET;
   if (appchannelReceivePacket(&command, sizeof(command), 0)) {
      return command;
   }
   return NO_PACKET;
}
