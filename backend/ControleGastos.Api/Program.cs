using ControleGastos.Api.Middlewares;
using ControleGastos.Application.Dtos;
using ControleGastos.Application.Queries;
using ControleGastos.Application.Service;
using ControleGastos.Application.UseCase;
using ControleGastos.Application.Validators;
using ControleGastos.Domain.Interfaces;
using ControleGastos.Infrastructure.Data;
using ControleGastos.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(op =>
op.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddValidatorsFromAssemblyContaining<PessoaValidator>();
builder.Services.AddFluentValidationAutoValidation();

// Service
builder.Services.AddScoped<PessoaService>();
builder.Services.AddScoped<CategoriaService>();
builder.Services.AddScoped<TransacaoService>();

// Repositorio
builder.Services.AddScoped<IPessoaRepository, PessoaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
builder.Services.AddScoped<ISaldoQuery, SaldoQueryRepository>();

// UseCase
builder.Services.AddScoped<CriarTransacaoUseCase>();
builder.Services.AddScoped<RelatorioTransacaoPorPessoaUseCase>();
builder.Services.AddScoped<RelatorioTransacaoPorCategoriaUseCase>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()   // libera qualquer origem (dev)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = string.Empty;
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Controle de Gastos API v1");
    });
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

app.MapControllers();


app.Run();





