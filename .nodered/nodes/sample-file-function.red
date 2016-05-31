var loopback = context.global.loopback;
var Device = loopback.models.Device;

console.log("Loopback Port: " + loopback.settings.host);

Device.find( { where: { deviceHubId: '566d85a22b937b4350d88d19' }, include: 'deviceType' }, function(err, devices) {
    if (err) return err;

    for(var i in devices) {
        console.log('Device: ' + devices[i].code + " - " + devices[i].description);
        console.log('Device Type: ' + devices[i].deviceType().code);
    }

    msg.payload = devices;
    node.send(msg);
});

return;
