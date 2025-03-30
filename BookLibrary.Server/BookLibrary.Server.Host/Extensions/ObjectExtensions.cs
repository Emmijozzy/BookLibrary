using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace BookLibrary.BookLibrary.Server.BookLibrary.Server.Host.Extensions
{

 public static class ObjectExtensions
    {
        /// <summary>
        /// Combines properties from source object with properties from additional object
        /// to create a merged anonymous object (similar to JavaScript spread operator)
        /// </summary>
        /// <param name="source">The source object whose properties will be included first</param>
        /// <param name="additional">The additional object whose properties will be added</param>
        /// <returns>A dynamic object containing all properties from both objects</returns>
        public static dynamic CombineObjects(object source, object additional)
        {
            if (source == null)
                return additional;

            // Create a dictionary to hold all properties
            var result = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
            
            // Add properties from the source object
            foreach (PropertyInfo property in source.GetType().GetProperties())
            {
                if (property.CanRead)
                {
                    var value = property.GetValue(source);
                    result[property.Name] = value!;
                }
            }
            
            // Add properties from the additional object, overwriting any duplicates
            foreach (PropertyInfo property in additional.GetType().GetProperties())
            {
                if (property.CanRead)
                {
                    var value = property.GetValue(additional);
                    result[property.Name] = value!;
                }
            }
            
            return result;
        }
    }


}