import React from 'react';
import './About.css';
import avatar from '../../images/avatar.png';

function About() {
  return (
    <section className="about">
      <div className='about__container'>
        <img src={avatar} alt="Avatar del autor" className="about__image" />
        <div className="about__text">
          <h2 className='about__text-title'>Acerca del autor</h2>
          <p className='about__text-description'>Este bloque describe al autor del proyecto. Aquí debe indicar tu nombre, a qué te dedicas y qué tecnologías de desarrollo conoces.</p>
          <p>También puedes hablar de tu experiencia con Practicum, de lo que aprendiste allí y de cómo puedes ayudar a los clientes potenciales.</p>
        </div>
      </div>
    </section>
  );
}

export default About;
