import React from "react";
import { Link } from 'react-router-dom';


export const Footer = () => (
  <footer className="footer d-flex flex-column py-3 text-center bg-dark bg-gradient min-vh-50">
    {/* <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div className="me-5 d-none d-lg-block">
        <span>Get connect with us!</span>
      </div>

      <div>
        <a href='' className='me-4 text-reset'>
          
        </a>
        <a href='' className='me-4 text-reset'>
          
        </a>
        <a href='' className='me-4 text-reset'>
          
        </a>
      </div>
    </section> */}

    <section>
      <div className="container text-center mt-5">
        <div className="row d-flex justify-content-center alignt-items-center">

          <div className="col mx-auto mb-2"> {/* Nombre compañia */}
            <h6 className="text-uppercase fw-bold mb-4 text-light text-decoration-underline">Company Name</h6>
            <span className="fs-6 fw-bold text-light"> &copy; Star-Trail</span>
          </div>

          <div className="col mx-auto mb-2"> {/* Links utiles */}

            <h6 className="text-uppercase fw-bold mb-4 text-light text-decoration-underline">Useful links</h6>

            <div className="d-flex flex-column">

              <Link to="/" className="text-light">
                Home
              </Link>

              <Link to="/terms-and-conditions" className="text-light">
                Terms and conditions - License
              </Link>

              <a href='https://4geeks.com/es' target="_blank" className='text-reset'>
                <span className="ms-1 text-light">
                  4GeeksAcademy
                </span>
              </a>

            </div>
          </div>

          <div className="col mx-auto mb-2"> {/* Datos de Contacto */}

            <h6 className="text-uppercase fw-bold mb-2 text-light text-decoration-underline">Contact</h6>

            <div className="d-flex flex-column">
              <a href='https://github.com/xXcarlos117Xx2' className='text-reset mb-2'>
                <i className="fab fa-github" style={{ color: "#ffffff" }}></i>
                <span className="ms-1 text-light">
                  Carlos Atanes
                </span>
              </a>

              <a href='https://github.com/JockerAG' className='text-reset mb-2'>
                <i className="fab fa-github" style={{ color: "#ffffff" }}></i>
                <span className="ms-1 text-light">
                  Alfredo Márquez
                </span>
              </a>

              <a href='https://github.com/AnnieRoro' className='text-reset'>
                <i className="fab fa-github" style={{ color: "#ffffff" }}></i>
                <span className="ms-1 text-light">
                  Annie Roldán
                </span>
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>

    <div className="text-center p-4 text-light text-decoration-underline">
      <p>&copy; 2024 Copyright: Star-Trail</p>
    </div>
  </footer>
);
