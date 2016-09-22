'use strict';

function serialParams(obj) {
    if(!obj) {
        return '';
    }
    const params = Object.keys(obj)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');

    if (params) {
        params += '?';
    }
    return params;
}

function get(url, params) {
    return fetch(`${url}${serialParams(params)}`)
        .then(res => res.json());
}

function post(url, params) {
    return fetch(url, {
        method: 'POST',
        body: params
    })
    .then(res => res.json());
}

function patch(url, params) {
    return fetch(url, {
        method: 'PATCH',
        body: params
    })
    .then(res => res.json());
}

describe('Demo', function () {
    it('should return -1 when the value is not present', function () {
        expect([1, 2, 3].indexOf(4)).to.equal(-1);
    });
});

describe('Driver', () => {
    describe('GET /api/driver', () => {
        it('should return all drivers', (done) => {
            get('/api/driver')
                .then((res) => {
                    expect(res).to.be.a('array');
                    done();
                });
        });
    });
    describe('GET /api/driver/:id', () => {
        it('should return 200 OK (first_name: John)', (done) => {
            get('/api/driver/d_1')
                .then((res) => {
                    expect(res.first_name).to.be('John');
                    done();
                });
        });

        it('should return 404', (done) => {
            get('/api/driver/d_xxx')
                .catch((res) => {
                    console.error(res);
                    expect(res).to.be.a('object');
                    done();
                });
        });
    });
    
    describe('POST /api/driver', () => {
        it('should return 201', (done) => {
            post('/api/driver', {
                "first_name": "Hector",
                "last_name": "Guo",
                "email": "zzz@xx.com",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res).to.be.a('object');
                done();
            });
        });
    })
});