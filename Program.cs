using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


var builder = WebApplication.CreateBuilder(args);

// Register dependencies
builder.Services.AddSingleton<IOrderStorage>(provider => OrderStorageSupplier.GetStorageSupplier());
builder.Services.AddSingleton<RabbitMQConsumerService>();
builder.Services.AddControllers();

var app = builder.Build();

// Map API controllers
app.MapControllers();

// Start the RabbitMQ consumer service in a background thread
var consumerService = app.Services.GetRequiredService<RabbitMQConsumerService>();
#pragma warning disable CS4014
Task.Run(async () => await consumerService.StartConsumingAsync());
#pragma warning restore CS4014

// Run the application
app.Run();
