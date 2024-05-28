$(document).ready(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#productForm').on('submit', function(event) {
        event.preventDefault();

        $.ajax({
            url: '/products',
            method: 'POST',
            data: $(this).serialize(),
            success: function(product) {
                $('#productTableBody').prepend(`
                    <tr data-id="${product.id}">
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price}</td>
                        <td>${formatDateTime(product.created_at)}</td>
                        <td>${product.quantity * product.price}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-product">Edit</button>
                        </td>
                    </tr>
                `);
                updateTotalValue();
            },
            error: function(response) {
                console.log(response.responseText);
            }
        });
    });

    $('#productTableBody').on('click', '.edit-product', function() {
        let row = $(this).closest('tr');
        let id = row.data('id');
        let name = row.find('td:eq(0)').text();
        let quantity = row.find('td:eq(1)').text();
        let price = row.find('td:eq(2)').text();

        row.html(`
            <td><input type="text" class="form-control" value="${name}"></td>
            <td><input type="number" class="form-control" value="${quantity}"></td>
            <td><input type="number" class="form-control" value="${price}" step="0.01"></td>
            <td>${formatDateTime(row.find('td:eq(3)').text())}</td>
            <td>${quantity * price}</td>
            <td>
                <button class="btn btn-sm btn-success save-product">Save</button>
            </td>
        `);
    });

    $('#productTableBody').on('click', '.save-product', function() {
        let row = $(this).closest('tr');
        let id = row.data('id');
        let name = row.find('input:eq(0)').val();
        let quantity = row.find('input:eq(1)').val();
        let price = row.find('input:eq(2)').val();

        $.ajax({
            url: `/products/${id}`,
            method: 'PUT',
            data: {
                _token: $('input[name="_token"]').val(),
                name: name,
                quantity: quantity,
                price: price
            },
            success: function(product) {
                row.html(`
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${formatDateTime(product.created_at)}</td>
                    <td>${product.quantity * product.price}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-product">Edit</button>
                    </td>
                `);
                updateTotalValue();
            }
        });
    });

    function updateTotalValue() {
        let total = 0;
        $('#productTableBody tr').each(function() {
            total += parseFloat($(this).find('td:eq(4)').text());
        });
        $('#totalValue').text(total);
    }

    function formatDateTime(datetime) {
        let date = new Date(datetime);
        return date.toLocaleString();
    }
});
