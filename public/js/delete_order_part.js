function deleteOrderPart(order_part_id) {
	let link= '/delete-order-part/';
	link += order_part_id;
	$.ajax({
		url: link,
		type: 'DELETE',
		success: function(result) {
			deleteRow(order_part_id);
			window.location.reload(true);
		}
	})
}

function deleteRow(order_part_id) {
	let table= document.getElementById("order-part-table");
	for (let i=0; i < 0; i++) {
		if (table.rows[i].getAttribute("data-value") == order_part_id) {
			table.deleteRow(i);
			break;
		}
	}
}