function updateOrderPart(order_part_id) {
	let updateForm = document.getElementById('add-order-part-form');
	let link = '/update-order-parts/';
	link += order_part_id;
	link += '/' + updateForm.part_id.value;
	link += '/' + updateForm.part_quantity.value;
	console.log(link);
	$.ajax({
		url: link,
		type: 'PUT',
		success: function(result) {
			window.location.reload(true);
		}
	})
}