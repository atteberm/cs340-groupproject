function search_orders() {
    let input = document.getElementById('update-order-form');
    let filter1 = input.order_num.value.toUpperCase();
    let filter2 = input.order_date.value.toUpperCase();
    let filter3 = input.order_complete.value.toUpperCase();
    let filter4 = input.employee_id.value.toUpperCase();
    let table = document.getElementById("orders-table");
    let tr = table.getElementsByTagName("tr");

    for (i = 2; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        td3 = tr[i].getElementsByTagName("td")[2];
        td4 = tr[i].getElementsByTagName("td")[3];

        if (td1 || td2 || td3) {
            txtValue = td1.textContent || td1.innerText;
            txtValue2 = td2.textContent || td2.innerText;
            txtValue3 = td3.textContent || td3.innerText;
            txtValue4 = td4.textContent || td4.innerText;
            if (txtValue.toUpperCase().indexOf(filter1) > -1 && txtValue2.toUpperCase().indexOf(filter2) > -1 && txtValue3.toUpperCase().indexOf(filter3) > -1 && txtValue4.toUpperCase().indexOf(filter4) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}