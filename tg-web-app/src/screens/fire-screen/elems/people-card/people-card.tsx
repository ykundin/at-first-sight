import { Link } from "react-router-dom";
import cn from "classnames";

import styles from "./people-card.module.css";

import type { HTMLAttributes, FC } from "react";
import type { People } from "../../../../domain/people";

export interface PeopleCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  people: People;
}

const PeopleCard: FC<PeopleCardProps> = (props) => {
  const { people, ...restProps } = props;

  return (
    <div
      {...restProps}
      className={cn(styles.card, { [styles.locked]: people.view === "locked" })}
    >
      <div className={styles.photo}>
        <img className={styles.image} src={people.image} alt="" />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.name}>
            {`${people.firstName}, ${people.age}`}
          </div>
          <div className={styles.description}>{people.description}</div>
        </div>

        <div className={styles.footer}>
          {people.view === "opened" ? (
            <Link className={styles.link} to="#">
              Send a message
            </Link>
          ) : (
            <Link className={styles.link} to="#">
              Open a profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
