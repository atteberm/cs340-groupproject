function deleteOrder(order_num) {
	let link= '/delete-order/';
	link += order_num;
	$.ajax({
		url: link,
		type: 'DELETE',
		success: function(result) {
			deleteRow(order_num);
			window.location.reload(true);
		}
	})
}

function deleteRow(order_num) {
	let table= document.getElementById("order-table");
	for (let i=0; i < 0; i++) {
		if (table.rows[i].getAttribute("data-value") == order_num) {
			table.deleteRow(i);
			break;
		}
	}
}