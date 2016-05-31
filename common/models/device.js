module.exports = function(Device) {
    Device.getAll = function(cb) {
        Device.find({where: {deviceHubId: '566d85a22b937b4350d88d19'}, include: 'deviceType'}, function (err, devices) {
            if (err) return cb(err);

            for (var i in devices) {
                console.log('Device: ' + devices[i].code + " - " + devices[i].description);
                console.log('Device Type: ' + devices[i].deviceType().code);
            }

            cb(err, devices);
        });
    }

    Device.remoteMethod (
        'getAll',
        {
            description : "Get devices",
            returns: {arg: 'devices', type: 'object', root: true},
            http: {verb: 'get'}
        }
    );
};

