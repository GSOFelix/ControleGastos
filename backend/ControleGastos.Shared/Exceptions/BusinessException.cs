using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Shared.Exceptions
{
    public class BusinessException : BaseException
    {
        public BusinessException(string message)
            : base(message, 422)
        {
        }
    }
}
