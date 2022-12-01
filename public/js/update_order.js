function updateOrder(order_num) {
	let updateForm = document.getElementById('update-order-form');
	let link = '/update-order/';
	link += order_num;
	link += '/' + updateForm.order_date.value;
	link += '/' + updateForm.order_complete.value;
	link += '/' + updateForm.employee_id.value;
	console.log(link);
	$.ajax({
		url: link,
		type: 'PUT',
		success: function(result) {
			window.location.reload(true);
		}
	})
}