#ifndef STAR_H
#define STAR_H

/********************************************************************************
  @brief: Represent a point in absolute coordinate. Position represent X and Y
* *******************************************************************************/
struct Point {
   double position[2];
};

/********************************************************************************
  @brief: Represent a list of Point
* *******************************************************************************/
struct ListPoint {
   int size;
   struct Point *data;
};

/********************************************************************************
  @brief: Represent point in a MAP : delta :
        * distance to go to origin (0.0)
        * position: index in the map array
        * parent: Node needed to go to this one
        * type :  '0' = OK  |  '1' = OBSTACLE
* *******************************************************************************/
struct Node {
   int delta;
   int position;
   struct Node *parent;
   char type;
};

/********************************************************************************
  @brief: Represent a list of Node :
        * size : total lenght of the list
        * width : lenght of one row
        * parent: Node needed to go to this one
        * grid_size : equivalance en mm of one node
* *******************************************************************************/
struct Map {
   int size;
   int width;
   struct Node *data;
   int grid_size;
};

/********************************************************************************
  @brief: Represent a list of Node :
        * size : total lenght of the list
* *******************************************************************************/

struct ListNode {
   int size;
   struct Node *data;
};

/********************************************************************************
  @brief: Generates a map with only node type = '1'.
        * At the begining, the drone have to think the is only obstacles.
  @params: none.
  @return: struct Map.
* *******************************************************************************/
struct Map generateMap();

/***********************************************************************
  @brief: Create a node from an absolute Point.
  @params: struct Point and struct Map.
  @return: struct Node.
**********************************************************************/
struct Node createNode(struct Point *point, struct Map *map);

/***********************************************************************
  @brief: Mesure the delta factor of the Node. it represente the difficulty
      *  need by the drone to move to this node.
  @params: 2 structs Node and struct Map.
  @return: void
* ********************************************************************/
void mesureDelta(struct Node *node, struct Node *target, struct Map *map);

/***********************************************************************
  @brief: Look in the list if a specific node already exsist
  @params: struct ListNode and struct Node.
  @return: struct Node
* ********************************************************************/
struct Node *checkIfAlreadyExist(struct ListNode *openListe, struct Node *node);

/***********************************************************************
  @brief: Add a Node into a list
  @params: 3 structs ListNode, 2 struct Node and struct Map
* ********************************************************************/
void addToList(struct ListNode *list, struct ListNode *openListe,
               struct ListNode *closeListe, struct Node *node,
               struct Node *target, struct Map *map);

/***********************************************************************
  @brief: Add a Node into a close list
  @params: struct ListNode and struct Node.
  @return: void
* ********************************************************************/
void addToCloseList(struct ListNode *closeListe, struct Node *node);

/***********************************************************************
  @brief: Merges two list
  @param: 2 struct ListNode
  @return: void
***********************************************************************/
void mergeList(struct ListNode *openListe, struct ListNode *list);

/***********************************************************************
  @brief: remove a Node from a list
  @param: struct ListNode and struct Node.
  @return: void
* ********************************************************************/
void removeToList(struct ListNode *openListe, struct Node *node);

/***********************************************************************
  @brief: Add the neighbours Drone of a specific Node:
  @param: 2 structs ListNode, 2 structs Node and struct Map.
  @return: void
* ********************************************************************/
void addNeighbour(struct ListNode *openListe, struct ListNode *closeListe,
                  struct Node *node, struct Node *target, struct Map *map);

/***********************************************************************
  @brief: Find the Node in a list that have the minimum delta factor
  @param: struct ListNode.
  @return: struct Node.
* ********************************************************************/
struct Node *find_min_node(struct ListNode *openListe);

/***********************************************************************
  @brief: Find a Node in a list.
  @param: struct Node and struct ListNode.
  @return: struct Node
* ********************************************************************/
struct Node *findNodeInList(struct Node *node, struct ListNode *list);

/***********************************************************************
  @brief: Take a Node and returne a point in absolute coordinate.
  @param: struct ListNode and struct Map.
  @return: struct ListPoint.
* ********************************************************************/
struct ListPoint transformNodePositionToPoint(struct ListNode *path,
                                              struct Map *map);

/***********************************************************************
  @brief: Algorithme A* see : https://fr.wikipedia.org/wiki/Algorithme_A*
  @param: struct Map and 2 structs Point.
  @return: struct ListPoint.
***********************************************************************/
struct ListPoint aStar(struct Map *map, struct Point start, struct Point end);

#endif