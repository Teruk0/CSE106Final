import sqlite3
from sqlite3 import Error

def createTable(_conn):
    _cur = _conn.cursor()
    _cur.execute("""
    create table if not exists credential (
        c_id integer primary key,
        c_name char(100),
        c_username char(100) not null unique,
        c_password char(100) not null,
        c_salt char(300)
    );
    """)

    _cur.execute("""
    create table if not exists post (
        p_id integer primary key,
        p_userId integer not null,
        p_question char(300) not null,
        p_upvotes integer not null,
        p_downvotes integer not null
    );
    """)

    _cur.execute("""
    create table if not exists response (
        r_id integer primary key,
        r_postId integer not null,
        r_userId integer not null,
        r_response char(300) not null,
        r_upvotes integer not null,
        r_downvotes integer not null
    );
    """)

    _cur.execute("""
    create table if not exists voted (
        v_id integer primary key,
        v_responseId integer not null,
        v_userId integer not null,
        v_voted char(100) not null,
        v_type char(100) not null
    );
    """)
    _conn.commit()

    _cur.close()

def dropAll(_conn):
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

    _cur.execute("""
    drop table if exists voted
    """)

    _conn.commit()
    _cur.close()

def populateTable(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Populate table")

    _cur = _conn.cursor()
    _cur.execute("""
    insert into credential (c_username, c_password, c_salt) 
    values ('JohnDoe', 'be68b7567183cc5b29e72742b00e12b5e859eb410d4a8669d13690e738590eb9', 'tCPSZZBs425tAJjcb4/OEw==')
    """)
    _cur.execute("""
    insert into credential (c_username, c_password, c_salt) 
    values ('JaneDoe', '21c251bc65ebeb13dc88c64d4ee8489ee3ebcb560b622ed49d489e8499d6c9d4', 'pB1SXmbs7pY2fl6LLemPAA==')
    """)

    _cur.execute("""
    insert into post (p_userid, p_question, p_upvotes, p_downvotes) 
    values (1, 'Do you like cats or dogs?', 1, 0)
    """)
    _cur.execute("""
    insert into post (p_userid, p_question, p_upvotes, p_downvotes) 
    values (1, 'What classes are you taking?', 0, 1)
    """)
    _cur.execute("""
    insert into post (p_userid, p_question, p_upvotes, p_downvotes) 
    values (2, 'To be or not to be?', 2, 0)
    """)

    _cur.execute("""
    insert into response (r_postId, r_userid, r_response, r_upvotes, r_downvotes) 
    values (1, 2, 'Cats!', 0, 0)
    """)
    _cur.execute("""
    insert into response (r_postId, r_userid, r_response, r_upvotes, r_downvotes) 
    values (3, 1, 'What does this mean?', 1, 1)
    """)
    _cur.execute("""
    insert into response (r_postId, r_userid, r_response, r_upvotes, r_downvotes) 
    values (3, 2, 'That is the question.', 2, 0)
    """)

    _cur.execute("""
    insert into voted (v_responseId, v_userId, v_voted, v_type) 
    values (1, 1, 'false', 'none')
    """)
    _cur.execute("""
    insert into voted (v_responseId, v_userId, v_voted, v_type) 
    values (1, 2, 'false', 'none')
    """)
    _cur.execute("""
    insert into voted (v_responseId, v_userId, v_voted, v_type) 
    values (2, 1, 'true', 'upvote')
    """)
    _cur.execute("""
    insert into voted (v_responseId, v_userId, v_voted, v_type) 
    values (2, 2, 'true', 'downvote')
    """)
    _cur.execute("""
    insert into voted (v_responseId, v_userId, v_voted, v_type) 
    values (3, 1, 'true', 'upvote')
    """)
    _cur.execute("""
    insert into voted (v_responseId, v_userId, v_voted, v_type) 
    values (3, 2, 'true', 'upvote')
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
    
    dropAll(_conn)
    createTable(_conn)
    populateTable(_conn)

    try:
        _conn.close()
        print("successful closure of Database")
    except Error as e:
        print(e)

if __name__ == "__main__":
    main()