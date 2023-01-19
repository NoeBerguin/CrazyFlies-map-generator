
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#include "star.h"

#define MAP_LENGHT 2500
#define MAP_WIDTH 50
#define TILE_EQUIVALANCE_CM 20
#define HALF 2
#define FACTOR_100 100
#define TILE_NOT_OBSTACLE '7'
#define TILE_OBSTACLE '1'

struct Map generateMap() {
   struct Node *data = calloc(1, MAP_LENGHT * sizeof(struct Node));
   struct Map map = {MAP_LENGHT, MAP_WIDTH, data, TILE_EQUIVALANCE_CM};
   for (int i = 0; i < map.size; i++) {
      map.data[i].position = i;
      map.data[i].type = TILE_OBSTACLE;
   }
   return map;
}

struct Node createNode(struct Point *point, struct Map *map) {
   int x = (point->position[0] / map->grid_size) + (map->width / HALF);
   int y = (point->position[1] / map->grid_size) + (map->width / HALF);
   int pos = y * map->width + x;
   struct Node node = {0, pos, NULL};
   return node;
}

void mesureDelta(struct Node *node, struct Node *target, struct Map *map) {
   int h = (abs(node->position / map->width - target->position / map->width) +
            abs(node->position % map->width - target->position % map->width)) *
           10;
   int g = 0;
   if (node->position == node->parent->position + 1) {
      g = 10;
   } else if (node->position == node->parent->position - 1) {
      g = 10;
   } else if (node->position == node->parent->position - map->width) {
      g = 10;
   } else if (node->position == node->parent->position - map->width - 1) {
      g = 14;
   } else if (node->position == node->parent->position - map->width + 1) {
      g = 14;
   } else if (node->position == node->parent->position + map->width - 1) {
      g = 14;
   } else if (node->position == node->parent->position + map->width + 1) {
      g = 14;
   } else if (node->position == node->parent->position + map->width) {
      g = 10;
   }
   node->delta = g + h;
}

struct Node *checkIfAlreadyExist(struct ListNode *openListe,
                                 struct Node *node) {
   for (int i = 0; i < openListe->size; i++) {
      if (openListe->data[i].position == node->position) {
         return &openListe->data[i];
      }
   }
   return NULL;
}

void addToList(struct ListNode *list, struct ListNode *openListe,
               struct ListNode *closeListe, struct Node *node,
               struct Node *target, struct Map *map) {
   if (map->data[node->position].type == '0' &&
       checkIfAlreadyExist(closeListe, node) ==
           NULL)  // if it's not an obstacle
   {
      struct Node *node_in_list = checkIfAlreadyExist(openListe, node);

      if (node_in_list == NULL) {
         mesureDelta(node, target, map);
         list->data =
             realloc(list->data, (list->size + 1) * sizeof(struct Node));
         list->data[list->size] = *node;
         list->size += 1;
      } else {
         node_in_list->parent = node->parent;
         mesureDelta(node_in_list, target, map);
      }
   }
}

void addToCloseList(struct ListNode *closeListe, struct Node *node) {
   struct Node *new_data =
       calloc(1, (closeListe->size + 1) * sizeof(struct Node));
   for (int i = 0; i < closeListe->size; i++) {
      new_data[i] = closeListe->data[i];
   }
   free(closeListe->data);
   new_data[closeListe->size] = *node;
   closeListe->data = new_data;
   closeListe->size += 1;
}

void mergeList(struct ListNode *openListe, struct ListNode *list) {
   openListe->data = realloc(
       openListe->data, (openListe->size + list->size) * sizeof(struct Node));
   int j = 0;
   for (int i = openListe->size; i < openListe->size + list->size; i++) {
      openListe->data[i] = list->data[j];
      j += 1;
   }
   openListe->size += list->size;
   free(list->data);
}

void removeToList(struct ListNode *openListe, struct Node *node) {
   for (int i = 0; i < openListe->size; i++) {
      if (openListe->data[i].position == node->position) {
         openListe->data[i].position =
             openListe->data[openListe->size - 1].position;
      }
   }
   openListe->size--;
   openListe->data =
       realloc(openListe->data, (openListe->size) * sizeof(struct Node));
}

void addNeighbour(struct ListNode *openListe, struct ListNode *closeListe,
                  struct Node *node, struct Node *target, struct Map *map) {
   struct ListNode list = {0, NULL};
   if (node->position == 0) {  // coin superieur gauche
      struct Node n1 = {0, node->position + 1, &map->data[node->position]};
      struct Node n2 = {0, node->position + map->width,
                        &map->data[node->position]};
      struct Node n3 = {0, node->position + map->width + 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
   } else if (node->position ==
              (map->size - map->width + 1)) {  // coin inferieur gauche
      struct Node n1 = {0, node->position + 1, &map->data[node->position]};
      struct Node n2 = {0, node->position - map->width,
                        &map->data[node->position]};
      struct Node n3 = {0, node->position - map->width + 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
   } else if (node->position == (map->size - 1)) {  // coin inferieur droit
      struct Node n1 = {0, node->position - 1, &map->data[node->position]};
      struct Node n2 = {0, node->position - map->width,
                        &map->data[node->position]};
      struct Node n3 = {0, node->position - map->width - 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
   } else if (node->position == map->width - 1) {  // coin superieur droit
      struct Node n1 = {0, node->position - 1, &map->data[node->position]};
      struct Node n2 = {0, node->position + map->width,
                        &map->data[node->position]};
      struct Node n3 = {0, node->position + map->width - 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
   } else if (node->position > 0 &&
              node->position < map->width) {  // borne superieur
      struct Node n1 = {0, node->position - 1, &map->data[node->position]};
      struct Node n2 = {0, node->position + 1, &map->data[node->position]};
      struct Node n3 = {0, node->position + map->width,
                        &map->data[node->position]};
      struct Node n4 = {0, node->position + map->width - 1,
                        &map->data[node->position]};
      struct Node n5 = {0, node->position + map->width + 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
      addToList(&list, openListe, closeListe, &n4, target, map);
      addToList(&list, openListe, closeListe, &n5, target, map);
   } else if (node->position % map->width == 0) {  // borne gauche
      struct Node n1 = {0, node->position - map->width,
                        &map->data[node->position]};
      struct Node n2 = {0, node->position + 1, &map->data[node->position]};
      struct Node n3 = {0, node->position + map->width,
                        &map->data[node->position]};
      struct Node n4 = {0, node->position - map->width + 1,
                        &map->data[node->position]};
      struct Node n5 = {0, node->position + map->width + 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
      addToList(&list, openListe, closeListe, &n4, target, map);
      addToList(&list, openListe, closeListe, &n5, target, map);
   } else if (node->position > (map->size - map->width + 2) &&
              node->position < (map->size - 2)) {  // borne inferieur
      struct Node n1 = {0, node->position - 1, &map->data[node->position]};
      struct Node n2 = {0, node->position + 1, &map->data[node->position]};
      struct Node n3 = {0, node->position - map->width,
                        &map->data[node->position]};
      struct Node n4 = {0, node->position - map->width + 1,
                        &map->data[node->position]};
      struct Node n5 = {0, node->position - map->width - 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
      addToList(&list, openListe, closeListe, &n4, target, map);
      addToList(&list, openListe, closeListe, &n5, target, map);
   } else if ((node->position + (node->position % map->width)) % map->width ==
              0) {  // borne droite
      struct Node n1 = {0, node->position - 1, &map->data[node->position]};
      struct Node n2 = {0, node->position - map->width - 1,
                        &map->data[node->position]};
      struct Node n3 = {0, node->position - map->width,
                        &map->data[node->position]};
      struct Node n4 = {0, node->position + map->width,
                        &map->data[node->position]};
      struct Node n5 = {0, node->position + map->width - 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
      addToList(&list, openListe, closeListe, &n4, target, map);
      addToList(&list, openListe, closeListe, &n5, target, map);
   } else {
      struct Node n1 = {0, node->position - 1, &map->data[node->position]};
      struct Node n2 = {0, node->position + 1, &map->data[node->position]};
      struct Node n3 = {0, node->position - map->width,
                        &map->data[node->position]};
      struct Node n4 = {0, node->position - map->width + 1,
                        &map->data[node->position]};
      struct Node n5 = {0, node->position - map->width - 1,
                        &map->data[node->position]};
      struct Node n6 = {0, node->position + map->width,
                        &map->data[node->position]};
      struct Node n7 = {0, node->position + map->width + 1,
                        &map->data[node->position]};
      struct Node n8 = {0, node->position + map->width - 1,
                        &map->data[node->position]};
      addToList(&list, openListe, closeListe, &n1, target, map);
      addToList(&list, openListe, closeListe, &n2, target, map);
      addToList(&list, openListe, closeListe, &n3, target, map);
      addToList(&list, openListe, closeListe, &n4, target, map);
      addToList(&list, openListe, closeListe, &n5, target, map);
      addToList(&list, openListe, closeListe, &n6, target, map);
      addToList(&list, openListe, closeListe, &n7, target, map);
      addToList(&list, openListe, closeListe, &n8, target, map);
   }
   mergeList(openListe, &list);
}

struct Node *find_min_node(struct ListNode *openListe) {
   struct Node *min = &openListe->data[0];
   for (int i = 1; i < openListe->size; i++) {
      if (openListe->data[i].delta < min->delta) {
         min = &openListe->data[i];
      }
   }

   struct Node *output = calloc(1, sizeof(struct Node));
   *output = *min;
   removeToList(openListe, min);
   return output;
}

struct Node *findNodeInList(struct Node *node, struct ListNode *list) {
   for (int i = 0; i < list->size; i++) {
      if (list->data[i].position == node->position) {
         return &list->data[i];
      }
   }
   return NULL;
}

struct ListPoint transformNodePositionToPoint(struct ListNode *path,
                                              struct Map *map) {
   struct ListPoint output = {path->size, NULL};
   output.data = calloc(1, path->size * sizeof(struct Point));
   int originPosY = map->width / HALF;
   int originPosX = map->width / HALF;
   for (int i = 1; i < path->size; i++) {
      struct Point point;
      int position = path->data[path->size - i].position;
      int posX = position % map->width;
      int posY = position / map->width;
      if (posX < originPosX && posY < originPosY) {
         point.position[0] = -abs(originPosX - posX) * map->grid_size;
         point.position[1] = -abs(originPosY - posY) * map->grid_size;
      } else if (posX >= originPosX && posY >= originPosY) {
         point.position[0] = abs(originPosX - posX) * map->grid_size;
         point.position[1] = abs(originPosY - posY) * map->grid_size;
      } else if (posX <= originPosX && posY >= originPosY) {
         point.position[0] = -abs(originPosX - posX) * map->grid_size;
         point.position[1] = abs(originPosY - posY) * map->grid_size;
      } else {
         point.position[0] = abs(originPosX - posX) * map->grid_size;
         point.position[1] = -abs(originPosY - posY) * map->grid_size;
      }
      point.position[0] += map->grid_size / HALF;
      point.position[1] += map->grid_size / HALF;
      point.position[0] = point.position[0] / FACTOR_100;
      point.position[1] = point.position[1] / FACTOR_100;
      output.data[i] = point;
   }
   return output;
}

struct ListPoint aStar(struct Map *map, struct Point start, struct Point end) {
   struct ListNode path = {0, NULL};
   struct ListNode openListe = {0, NULL};
   struct ListNode closeListe = {0, NULL};
   struct Node start_node = createNode(&start, map);
   struct Node end_node = createNode(&end, map);
   map->data[start_node.position].type = TILE_NOT_OBSTACLE;
   map->data[end_node.position].type = '0';
   addToCloseList(&closeListe, &start_node);
   addNeighbour(&openListe, &closeListe, &start_node, &end_node, map);
   int i = 0;
   while (i == 0) {
      struct Node *current_node = find_min_node(&openListe);
      addToCloseList(&closeListe, current_node);
      addNeighbour(&openListe, &closeListe, current_node, &end_node, map);
      map->data[current_node->position].type = TILE_NOT_OBSTACLE;
      if (current_node->position == end_node.position) {
         i = 1;
         int j = 1;
         addToCloseList(&path, &end_node);
         addToCloseList(&path, current_node);
         struct Node *parent =
             findNodeInList(current_node->parent, &closeListe);
         if (parent) {
            while (parent->parent != NULL) {
               addToCloseList(&path, parent);
               parent = findNodeInList(parent->parent, &closeListe);
               j += 1;
            }
            addToCloseList(&path, parent);
         }

         free(current_node);
      } else {
         free(current_node);
      }
   }
   map->data[end_node.position].type = '8';
   free(openListe.data);
   free(closeListe.data);

   struct ListPoint listOutput = transformNodePositionToPoint(&path, map);
   free(path.data);
   return listOutput;
}
