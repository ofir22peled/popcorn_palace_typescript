using Microsoft.AspNetCore.Mvc;

namespace consumer
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderStorage _orderStorage;

        public OrdersController(IOrderStorage orderStorage)
        {
            _orderStorage = orderStorage;
        }

        [HttpGet("order-details/{orderId}")]
        public IActionResult GetOrderDetails(string orderId)
        {
            var order = _orderStorage.GetOrderDetails(orderId);
            if (order != null)
            {
                return Ok(new
                {
                    order.OrderId,
                    order.CustomerId,
                    order.TotalAmount,
                    order.ShippingCost,
                    order.Items
                });
            }
            else
            {
                return NotFound(new
                {
                    Message = $"Order with ID {orderId} not found.",
                    ErrorCode = 404
                });
            }
        }
    }
}