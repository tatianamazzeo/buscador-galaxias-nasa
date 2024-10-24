document.addEventListener("DOMContentLoaded", () => {
  const DATOS_URL = "https://images-api.nasa.gov/search?q=andromeda";

  fetch(DATOS_URL) //Fetch que va a la API y trae la respuesta en JSON, y luego corre la funcion showImages
    .then((response) => response.json()) //Convertir la respuesta a JSON
    .then((data) => {
      console.log(data); //Loguear la respuesta para ver la estructura
      search(data);
    })
    .catch((error) => {
      console.log(`Error obteniendo los datos: `, error); //Loguear errores
    });

  function search(data) {
    const botonBuscar = document.getElementById("btnBuscar");
    const inputBuscar = document.getElementById("inputBuscar");
    const contenedor = document.getElementById("contenedor");

    // Evento de búsqueda cuando se hace clic en el botón
    botonBuscar.addEventListener("click", () => {
      // Convertimos a minúsculas para comparar sin distinción de mayúsculas/minúsculas
      const textoBuscar = inputBuscar.value.toLowerCase();
      // Limpiar el contenedor antes de mostrar los resultados
      contenedor.innerHTML = "";

      // Filtrar los elementos que coincidan con el texto ingresado
      const resultadosFiltrados = data.collection.items.filter((elemento) => {
        const titulo = elemento.data[0]?.title?.toLowerCase() || "";
        const descripcion = elemento.data[0]?.description?.toLowerCase() || "";
        return (
          titulo.includes(textoBuscar) || descripcion.includes(textoBuscar)
        ); // Buscar coincidencias en título o descripción
      });

      // Mostrar los resultados filtrados
      if (resultadosFiltrados.length > 0) {
        resultadosFiltrados.forEach((elemento) => {
          //El for each que recorre el arreglo

          //Acceder a los datos
          const title = elemento.data[0]?.title || "No title available"; //Accedemos al titulo
          const image = elemento.links?.[0].href || "/img/no-image.avif"; //Accedemos a la imagen
          const description =
            elemento.data[0]?.description || "No description available"; //Accedemos a la descripcion
          const date = elemento.data[0]?.date_created || "No date available";

          // Crear tarjeta de Bootstrap
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("col-md-4", "mb-4"); // Clase para columnas de Bootstrap y margen
          const card = `
    <div class="card">
      <img src="${image}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <div class="description" style="max-height: 100px; overflow-y: auto;">
          <p class="card-text">${
            elemento.data[0]?.description || "No description available."
          }</p>
        </div>
      </div>
    </div>
  `;
          cardDiv.innerHTML = card; // Asignar el HTML de la tarjeta
          contenedor.append(cardDiv); // Agregar la tarjeta al contenedor
        });
      } else {
        contenedor.innerText = "No se encontraron resultados"; // Mensaje si no hay resultados
      }
    });
  }
});
