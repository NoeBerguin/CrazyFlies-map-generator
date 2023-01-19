import json
import psycopg2

#############################################################################
#### This class represent the data base of our application.
#### It is use to communicate whith a postgre data base and
#### to stock the current connected drones.
#############################################################################
class Database:
    # DATA BASE variable
    DB_HOST = "0.0.0.0"
    DB_NAME = "noe"
    DB_USER = "postgres"
    DB_PASS = "postgres"

    # 0 = Physic , 1 = Simulation, 2 = unknow
    MISSION_MODE = 2
    cur = None
    conn = None

    #############################################################################
    #### this fonction is call at the ceation of the object, it try to connect
    #### the server with the data base
    #############################################################################
    def __init__(self):
        try:
            self.conn = psycopg2.connect(
                dbname=self.DB_NAME,
                user=self.DB_USER,
                password=self.DB_PASS,
                host=self.DB_HOST,
            )
            self.cur = self.conn.cursor()
            self.cur.execute(
                "CREATE TABLE IF NOT EXISTS Mission ( id INT NOT NULL, name VARCHAR(20),date DATE,time TIME,nbDrones INT,type VARCHAR(20),totalDistance INT, map VARCHAR[], logs TEXT,PRIMARY KEY (Id));"
            )
            self.conn.commit()
        except psycopg2.Error:
            pass

    #############################################################################
    #### Add mission into the database
    #### @param {Mission} mission
    #############################################################################
    def add_mission(self, mission):
        if self.cur != None:
            self.cur.execute(
                "INSERT INTO mission (id, name, map, date, time, type, nbDrones, logs) VALUES ({0}, '{1}', ARRAY{2}, '{3}', '{4}', '{5}', '{6}', '{7}');".format(
                    mission["id"], mission["name"], mission["map"], mission["date"], mission["time"], mission["type"], mission["nbDrones"], mission["logs"]
                )
            )
            self.conn.commit()
            return 1
        return 0

    #############################################################################
    #### Get all the missions into the database and transform it to Json format
    #### @Return {Json} lis of mission
    #############################################################################
    def get_mission_history(self):
        query = "SELECT * FROM mission;"
        self.cur.execute(query)
        return self.jsonify_missions(self.cur.fetchall())

    #############################################################################
    #### Get a list of mission and transform it to Json format
    #### to send it to the user
    #### @Return {Mission[]} listMission
    #############################################################################
    def jsonify_missions(self, missions):
        json_missions = []
        for mission in missions:
            data = {
                "id": mission[0],
                "name": str(mission[1]),
                "date": str(mission[2]),
                "time": str(mission[3]),
                "type": str(mission[5]),
                "totalDistance": 0,
                "nbDrones": mission[6],
                "map": mission[7],
                "logs": mission[8]
            }
            json_dump = json.dumps(data)
            json_missions.append(json_dump)
        return json_missions

    #############################################################################
    #### Delete a mission on the data base using the ID
    #### @param {String} id
    #############################################################################
    def delete_mission(self, mission) -> None:
        query = "DELETE FROM mission WHERE id = '{0}';".format(mission["id"])
        self.cur.execute(query)
        self.conn.commit()
