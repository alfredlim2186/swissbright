import sqlite3
import uuid

def main():
    conn = sqlite3.connect('dev.db')
    cursor = conn.cursor()
    code = 'c9376e98836f316bf4133941da0210624996d6ba04fe243e2618edd84155d7ba'
    security = 'abbf3db594dfcf01807a6132931d8f0233ac35d21a02a828e29b8ede1ec4fbaa'
    cursor.execute('SELECT id FROM VerificationCode WHERE codeHash=?', (code,))
    row = cursor.fetchone()

    if not row:
        cursor.execute(
            'INSERT INTO VerificationCode (id, codeHash, securityHash, codeLast4, securityLast4, codeValue, securityCodeValue, batch, productId) VALUES (?,?,?,?,?,?,?,?,?)',
            (str(uuid.uuid4()), code, security, '5678', '1234', '012345678', '1234', 'ADMIN', 'sweetb-001'),
        )
        conn.commit()
        print('inserted')
    else:
        print('present')

    conn.close()


if __name__ == '__main__':
    main()

