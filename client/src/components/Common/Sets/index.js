import React from 'react';
import { getRcolor } from './../../../utils';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import styles from './sets.module.css';

const Sets = ({ sets }) => {
  const renderSet = (set, i) => {
    return (
      <div key={i} className={styles.set}>
        {set.map((t, j) => {
          const classes = classnames(styles.setItem, styles[getRcolor(t.r)]);
          const day = t.time.split(' ')[0].replace(/\//g, '-');
          return (
            <Link key={j} to={`review/${day}/${t.id}`}>
              <div className={classes}>{t.r}</div>
            </Link>
          );
        })}
      </div>
    );
  };

  if (sets?.length) {
    return (
      <div>
        <h4>Sets</h4>
        <div>{sets.map((s, i) => renderSet(s, i))}</div>
      </div>
    );
  } else {
    return 'No sets available';
  }
};

export default Sets;
