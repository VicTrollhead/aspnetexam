using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace FTCS
{
    /// <summary>
    /// Class for serializing and deserializing objects in JSON format.
    /// </summary>
    public class JsonSerialization
    {
        /// <summary>
        /// Saves an object to a file in JSON format.
        /// </summary>
        /// <typeparam name="T">Type of the object to save.</typeparam>
        /// <param name="file">The path to the file where the object will be saved.</param>
        /// <param name="obj">The object to be serialized.</param>
        public static void Save<T>(string file, T obj)
        {
            DataContractJsonSerializer formatter = new DataContractJsonSerializer(typeof(T));
            using (var fs = File.Create(file))
            {
                formatter.WriteObject(fs, obj);
            }
            Console.WriteLine("JsonSerializer Serialize is OK");
        }

        /// <summary>
        /// Loads an object from a file in JSON format.
        /// </summary>
        /// <typeparam name="T">Type of the object to load.</typeparam>
        /// <param name="file">The path to the file from which the object will be loaded.</param>
        /// <returns>The loaded object or null if the file is empty.</returns>
        public static T? Load<T>(string file) where T : class
        {
            T? obj;
            DataContractJsonSerializer formatter = new DataContractJsonSerializer(typeof(T));
            using (var fs = File.OpenRead(file))
            {
                if (fs.Length > 0)
                {
                    obj = formatter.ReadObject(fs) as T;
                    return obj;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}