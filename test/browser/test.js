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

const driverOne = {
  firstName: "John",
  lastName: "Smith",
  emailAddress: "test-98989@example.com",
  password: "anypwd",
  addressLine1: "454 Main Street",
  addressLine2: "",
  city: "Anytown",
  state: "AS",
  zip: "83874",
  phoneNumber: "408-555-2737",
  drivingLicense: "D162373",
  licensedState: "CA"
};


var driverOneId;

it('drivers01_should_create_driver', (done) => {
    post('/api/drivers', params)
        .then((res) => {
            
        })
}); function(done){
  supertest(app)
  .
  .send(driverOne)
  .expect(201)
  .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
    assert.ok(typeof response.body === 'object');
    driverOneId = response.body._id;
    return done();
  });
};

it('drivers02_should_get_driver', (done) => {

}); function(done){
  supertest(app)
      .get('/api/drivers/' + driverOneId)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
          assert.ok(response.statusCode == 200);
        assert.ok(typeof response.body === 'object');
        return done();
      });
};


it('drivers03_should_delete_driver', (done) => {

}); function(done){
  supertest(app)
      .delete('/api/drivers/' + driverOneId)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
//        assert.ok(typeof response.body === 'object');
          assert.ok(response.statusCode == 200);
        return done();
      });
};

it('drivers04_should_not_get_deleted_driver', (done) => {

}); function(done){
    supertest(app)
        .get('/api/drivers/' + driverOneId)
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response);
            assert.ok(response.statusCode == 404);
//            assert.ok(typeof response.body === 'object');
            return done();
        });
};

it('drivers05_should_not_get_random_id_driver', (done) => {

}); function(done){
    supertest(app)
        .get('/api/drivers/7383883373838')
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response);
//            assert.ok(typeof response.body === 'object');
            assert.ok(response.statusCode == 404);
            return done();
        });
};


it('drivers06_should_not_create_driver_missing_email_address', (done) => {

}); function(done){
    delete driverOne.emailAddress;
    supertest(app)
        .post('/api/drivers')
        .send(driverOne)
        .expect(400)
        .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};

it('drivers07_should_not_create_driver_with_long_first_name', (done) => {

}); function(done){
    driverOne.firstName = "1234567890123456";
    driverOne.emailAddress = 'test7383738983@example.com';
    supertest(app)
        .post('/api/drivers')
        .send(driverOne)
        .expect(400)
        .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};


describe('Driver', () => {
    describe('GET /api/drivers', () => {
        it('should return all drivers', (done) => {
            get('/api/drivers')
                .then((res) => {
                    expect(res).to.be.a('array');
                    done();
                });
        });
    });
    describe('GET /api/drivers/:id', () => {
        it('should return 200 OK (first_name: AABB)', (done) => {
            get('/api/drivers/d_1')
                .then((res) => {
                    expect(res.first_name).to.be('AABB');
                    done();
                });
        });

        it('should return 404', (done) => {
            get('/api/drivers/d_xxx')
                .then((res) => {
                    expect(res.status).to.be(404);
                    done();
                });
        });
    });
    
    describe('POST /api/drivers', function() {
        it('should return 201', function(done) {
            post('/api/drivers', {
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
            post('/api/drivers', {
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

    describe('PATCH /api/drivers/d_1', () => {
        it('should return 201', (done) => {
            patch('/api/drivers/d_1', {
                "first_name": "AABB",
                "phone_number": "6503334444"
            })
            .then((res) => {
                expect(res).to.be.empty();
                done();
            });
        });
        it('should return first_name required', (done) => {
            patch('/api/drivers/d_xx1', {
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
            get('/api/drivers/d_1/car')
            .then((res) => {
                expect(res).to.be.a('object');
                done();
            });
        });
    });
    describe('Create car in a driver (override old info if exist)', () => {
        it('should return a car_id', (done) => {
            post('/api/drivers/d_1/car', {
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
            post('/api/drivers/d_1/car', {
                "color": "white"
            })
            .then((res) => {
                expect(res).to.have.key('car_id');
            })
            .then(() => get('/api/drivers/d_1/car'))
            .then((res) => {
                expect(res.color).to.be('white');
            });
        });
    });
    describe('Remove car by driver_id', () => {
        it('should return no content', (done) => {
            del('/api/drivers/d_1/car')
            .then((res) => {
                expect(res).to.have.key('msg');
            });
        });
    });
});

describe('Passenger', () => {
    describe('Get passenger', () => {
        it('should return all passengers', (done) => {
            get('/api/passengers')
            .then((res) => {
                expect(res).to.be.an('array');
                done();
            });
        });
        it('should return one passenger', (done) => {
            get('/api/passengers/p_1')
            .then((res) => {
                expect(res).to.be.an('object');
                done();
            });
        });
    });
    describe('Create passenger', () => {
        it('should return a passenger_id', (done) => {
            post('/api/passengers', {
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
            patch('/api/passengers/p_1', {
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
            del('/api/passengers/p_1')
            .then((res) => {
                expect(res).to.be.an('object');
                done();
            });
        });
    });
});