'use strict';

const utils = require('../utils'); 

class ModelHandle {
    constructor(model, name) {
        this.model = model;
        this.name = name;
    }
    get(id) {
        return new Promise((resolve, reject) => {
            const Model = this.model;
            if (!id) {
                Model.find((err, items) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(items);
                });
                return;
            }
            Model.findById(id, (err, item) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(item);
                }
            });
        });
    }
    create(info) {
        return new Promise((resolve, reject) => {
            if (!info || !Object.keys(info).length) {
                // simulate mongoose error
                reject({
                    kind: 'empty',
                    path: this.name
                });
                // utils.throwIfMissing(`${this.name} info`);
            }

            if (info.id || info._id) {
                reject({
                    kind: 'noId',
                    path: this.name
                });
            }

            const Model = this.model;
            const model = new Model(info);
            // car.license = req.body.license;

            model.save((err) => {
                if (err) {
                    reject(err);
                    // res.status(500).send(err);
                } else {
                    resolve({ "message": `${this.name} Created`, "created": model });
                    // res.status(201).json();
                }
            });
        });
    }
    update(id, info) {
        return new Promise((resolve, reject) => {
            const Model = this.model;
            if (!info) {
                utils.throwIfMissing('update info');
            }
            if (!id) {
                utils.throwIfMissing('id');
            }
            this.get(id)
                .then((model) => {
                    Object.assign(model, info);
                    model.save((err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve({ "message": `${this.name} Created`, "created": model });
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    del(id) {
        return new Promise((resolve, reject) => {
            const Model = this.model;
            Model.remove({
                _id: id
            }, (err, item) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ "message": `${this.name} Deleted` });
                }
            });
        });
    }
}

module.exports = ModelHandle;