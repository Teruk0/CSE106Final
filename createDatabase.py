import sqlite3
from sqlite3 import Error

def createTable(_conn):
    _cur = _conn.cursor()
    _cur.execute("""
    create table if not exists credential (
        c_id integer primary key,
        c_name char(100),
        c_username char(100) not null unique,
        c_password char(100) not null
    );
    """)

    _cur.execute("""
    create table if not exists post (
        p_id integer primary key,
        p_userId char(100) not null,
        p_question char(300) not null,
        p_upvotes char(100) not null,
        p_downvotes char(100) not null
    );
    """)

    _cur.execute("""
    create table if not exists response (
        r_id integer primary key,
        r_postId char(100) not null,
        r_userId    
        r_response char(300) not null,
        r_upvotes integer not null,
        r_downvotes integer not null
    );
    """)
    _conn.commit()

    _cur.close()


def dropTable(_conn):
    _cur = _conn.cursor()

    _cur.execute("""
    drop table if exists credential
    """)

    _cur.execute("""
    drop table if exists post
    """)

    _cur.execute("""
    drop table if exists response
    """)

    _conn.commit()
    _cur.close()



def main():
    _conn = None
    try:
        _conn = sqlite3.connect("forumData.sqlite")
        print("successful connection to Database")
    except Error as e:
        print(e)
    
    dropTable(_conn)
    createTable(_conn)

    try:
        _conn.close()
        print("successful closure of Database")
    except Error as e:
        print(e)

if __name__ == "__main__":
    main()