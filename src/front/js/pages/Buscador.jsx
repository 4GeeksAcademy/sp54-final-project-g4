import React from "react";

export const Buscador = () => {
    return (
        <div className="container">
            <div className="d-flex justify-content-between">
                <div className="container-fluid col-8 mt-5">
                    <h1 className="mb-3">Movies</h1>
                    <div className="list-group col-6">
                        <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
                            <img src="https://placehold.co/60x90" alt="..." />  The current link item
                        </a>
                        <a href="#" className="list-group-item list-group-item-action"><img src="https://placehold.co/60x90" alt="..." /> A second link item</a>
                        <a href="#" className="list-group-item list-group-item-action"><img src="https://placehold.co/60x90" alt="..." /> A third link item</a>
                        <a href="#" className="list-group-item list-group-item-action"><img src="https://placehold.co/60x90" alt="..." /> A fourth link item</a>

                    </div>
                </div>
                <div className="container-fluid mt-5">
                    <h2>Tags </h2>
                    <div className="col-6">
                        <button type="button" className="btn btn-outline-secondary m-2">Tag 1</button>
                        <button type="button" className="btn btn-outline-secondary m-2">Tag 2</button>
                        <button type="button" className="btn btn-outline-secondary m-2">Tag 3</button>
                        <button type="button" className="btn btn-outline-secondary m-2">Tag 4</button>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-5">
                <h1 className="mb-3">Users</h1>
                <div className="list-group col-4">
                    <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
                        <img src="https://placehold.co/50x50" className="rounded-circle" alt="..." /> The current link item
                    </a>
                    <a href="#" className="list-group-item list-group-item-action"><img src="https://placehold.co/50x50" className="rounded-circle" alt="..." /> A second link item</a>
                    <a href="#" className="list-group-item list-group-item-action"><img src="https://placehold.co/50x50" className="rounded-circle" alt="..." /> A third link item</a>
                    <a href="#" className="list-group-item list-group-item-action"><img src="https://placehold.co/50x50" className="rounded-circle" alt="..." /> A fourth link item</a>

                </div>
            </div>
        </div>
    )
}