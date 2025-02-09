import DefaultLayout from "@/layouts/default"
import { title } from "@/components/primitives"
export const Home = () =>{
 return(
    <DefaultLayout>
        <span className={title()}>Home</span>
    </DefaultLayout>
 )
}
export default Home;