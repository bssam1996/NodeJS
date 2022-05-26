import headerStyle from "../styles/Header.module.css"
const Header = ()=> {
    return (
      <div>
          <h1 className={headerStyle.title}>
              <span>WebDev</span> News
          </h1>
          <p className={headerStyle.description}>This is a description</p>
      </div>
    )
}

export default Header