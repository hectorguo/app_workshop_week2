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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(res => res.json());
}

function patch(url, params) {
    return fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(res => res.json());
}

function del(url, params) {
    return fetch(`${url}${serialParams(params)}`)
        .then(res => res.json());
}

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
        it('should return 200 OK (first_name: AABB)', (done) => {
            get('/api/driver/d_1')
                .then((res) => {
                    expect(res.first_name).to.be('AABB');
                    done();
                });
        });

        it('should return 404', (done) => {
            get('/api/driver/d_xxx')
                .then((res) => {
                    expect(res.status).to.be(404);
                    done();
                });
        });
    });
    
    describe('POST /api/driver', function() {
        it('should return 201', function(done) {
            post('/api/driver', {
                "first_name": "Hector",
                "last_name": "Guo",
                "email": "zzz@xx.com",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res.driver_id).to.be.a('string');
                done();
            });
        });
        it('should return first_name required', function(done) {
            post('/api/driver', {
                "last_name": "Guo",
                "email": "zzz@xx.com",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res.status).to.be(400);
                done();
            });
        });
    });

    describe('PATCH /api/driver/d_1', () => {
        it('should return 201', (done) => {
            patch('/api/driver/d_1', {
                "first_name": "AABB",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res).to.be.empty();
                done();
            });
        });
        it('should return first_name required', (done) => {
            patch('/api/driver/d_xx1', {
                "last_name": "Guo",
                "email": "zzz@xx.com",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res.status).to.be(400);
                done();
            });
        });
    })
});

describe('Car (sub resource)', () => {
    describe('Get car by driver_id', () => {
        it('should return a car info', (done) => {
            get('/api/driver/d_1/car')
            .then((res) => {
                expect(res).to.be.a('object');
                done();
            });
        });
    });
    describe('Create car in a driver (override old info if exist)', () => {
        it('should return a car_id', (done) => {
            post('/api/driver/d_1/car', {
                "model": "Model E",
                "made": "Tesla",
                "door_number": 4,
                "color": "black",
                "plate_number": "XNSSSS"
            })
            .then((res) => {
                expect(res).to.have.key('car_id');
                done();
            });
        });
    });
    describe('Update car by driver_id', () => {
        it('should return no content', (done) => {
            post('/api/driver/d_1/car', {
                "color": "white"
            })
            .then((res) => {
                expect(res).to.have.key('car_id');
            })
            .then(() => get('/api/driver/d_1/car'))
            .then((res) => {
                expect(res.color).to.be('white');
            });
        });
    });
    describe('Remove car by driver_id', () => {
        it('should return no content', (done) => {
            del('/api/driver/d_1/car')
            .then((res) => {
                expect(res).to.have.key('msg');
            });
        });
    });
});

describe('Passenger', () => {
    describe('Get passenger', () => {
        it('should return all passengers', (done) => {
            get('/api/passenger')
            .then((res) => {
                expect(res).to.be.an('array');
                done();
            });
        });
        it('should return one passenger', (done) => {
            get('/api/passenger/p_1')
            .then((res) => {
                expect(res).to.be.an('object');
                done();
            });
        });
    });
    describe('Create passenger', () => {
        it('should return a passenger_id', (done) => {
            post('/api/passenger', {
                "first_name": "hector",
                "last_name": "Guo",
                "email": "zzz@xx.com",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res).to.have.key('passenger_id');
                done();
            });
        });
    });
    describe('Update passenger', () => {
        it('should return 204 no content', (done) => {
            patch('/api/passenger/p_1', {
                "email": "zzz@xxx.com",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res).to.be.empty();
                done();
            });
        });
    });
    describe('Remove passenger', () => {
        it('should return 200 OK', (done) => {
            del('/api/passenger/p_1')
            .then((res) => {
                expect(res).to.be.an('object');
                done();
            });
        });
    });
});