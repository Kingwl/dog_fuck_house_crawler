module.exports = function parseHouse($, house_node) {
    let result = {};
    result.specs = [];

    result.sale = house_node.find('.zfjsale').text();
    let house_detail_node = house_node.find('a');
    result.url = house_detail_node.attr('href');

    let des_node = house_detail_node.find('.des');

    result.place = des_node.find('h2').text();
    result.dist = des_node.find('.dist').text();

    let room_data = des_node.find('.room').text().split("\r\n").map(x => x.trim()).filter(x => x.length > 0);
    result.type = room_data[0];
    result.size = room_data[1];
    result.floor = room_data[2];
    result.short_rent = room_data[3] === undefined;

    des_node.find('.spec').children().each(function (i, ele) {
        let spec = $(this);
        result.specs.push(spec.text());
    });

    let money_node = house_detail_node.find('.money');
    result.money = money_node.find('span > b').text();
    result.month = money_node.find('p').text();

    return result;
}