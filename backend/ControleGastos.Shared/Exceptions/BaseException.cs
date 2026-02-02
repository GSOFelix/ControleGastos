using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Shared.Exceptions
{
    public abstract class BaseException : Exception
    {
        public int StatusCode { get; }

        protected BaseException(string message, int statusCode)
            : base(message)
        {
            StatusCode = statusCode;
        }

        protected BaseException(string message, int statusCode, Exception innerException)
       : base(message, innerException)
        {
            StatusCode = statusCode;
        }
    }
}
