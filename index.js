data_array = [];

$(".add").click(function () {
      name = $(this).parent().siblings('.name').html();
      jenis = $(this).data('jenis');
      price = $(this).data('price');
      count = $(this).parent().siblings('.count').html();

      count = parseInt(count) + 1


      data_array.push({
            name: name,
            count: count,
            price: price
      })

      for (i in data_array) {
            if (data_array[i].name == name && data_array[i].count < count) {
                  data_array.splice(i, 1);
                  continue;
            }
      }

      data = ''
      total_harga = 0
      for (i in data_array) {
            data += '<tr>'
            data += '<td>' + data_array[i].name + ' </td>'
            data += '<td>x' + data_array[i].count + ' </td>'
            data += '<td>' + data_array[i].price + ' </td>'
            data += '</tr>'
            total_harga += harga(data_array[i].price, data_array[i].count)
      }
      console.log(data)
      $('#total-table tbody').html(data);
      $('#total-table .total-price').html(total_harga);
      $(this).parent().siblings('.count').html(count);

});

$(".remove").click(function () {
      name = $(this).parent().siblings('.name').html();
      jenis = $(this).data('jenis');
      price = $(this).data('price');
      count = $(this).parent().siblings('.count').html();

      count = (parseInt(count) - 1 < 0) ? 0 : parseInt(count) - 1

      if (count != 0) {
            data_array.push({
                  name: name,
                  count: count,
                  price: price
            })
      }

      for (i in data_array) {
            if (data_array[i].name == name && data_array[i].count > count) {
                  data_array.splice(i, 1);
                  continue;
            }
      }

      console.log(data_array)
      data = ''
      total_harga = 0
      for (i in data_array) {
            data += '<tr>'
            data += '<td>' + data_array[i].name + ' </td>'
            data += '<td>x' + data_array[i].count + ' </td>'
            data += '<td>' + data_array[i].price + ' </td>'
            data += '</tr>'
            total_harga += harga(data_array[i].price, data_array[i].count)
      }

      $('#total-table tbody').html(data);
      $('#total-table .total-price').html(total_harga);
      $(this).parent().siblings('.count').html(count);

});

function harga(price, count) {
      return price * count;
}

$('#sendMessageButton').click(function () {
      data = ''
      total_harga = 0

      for (i in data_array) {
            data += `* ${data_array[i].count} ${data_array[i].name}\n`
            total_harga += harga(data_array[i].price, data_array[i].count)
      }
      if (total_harga > 0) {
            data += `* Total: ${total_harga}`
            pesan = `Hai Customer,\n\nTerima kasih telah memesan menu,\nberikut adalah review pesanannya:\n\n${data}\n\nPesanan kakak akan segera diproses dan akan diberitahu jika sudah bisa diambil.\n\nMohon ditunggu ya!`;
            if (!liff.isInClient()) {
                  sendAlertIfNotInClient();
            } else {
                  liff.sendMessages([{
                        'type': 'text',
                        'text': pesan
                  }]).then(function () {
                        M.toast({ html: '<span>Periksa inbox anda. Kami telah mengirimkan detail pesanan anda.</span><button id="close" class="btn-flat toast-action">Tutup</button>' });
                        document.getElementById('close').addEventListener('click', function () {
                              liff.closeWindow();
                        });
                  }).catch(function (error) {
                        M.toast({ html: `Error sending message: ${error}` });
                  });
            }
      } else {
            M.toast({ html: `Mohon pesan terlebih dahulu kak!` });
      }

});

