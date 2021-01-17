/*  
    Planar diagram of a knot.  For details, see:
    http://katlas.org/wiki/Planar_Diagrams
    Check c++ original version
    https://github.com/cseed/knotkit
*/
class planar_diagram
{
    constructor(o){
        this.name=o.name;
        this.crossings=o.crossings;
    }
    show_knottheory ()
    {
        console.log ("PD[");
        for (let i = 1; i <= this.crossings.length; i ++)
        {
            if (i > 1)  console.log (",");
            console.log ("X[", 
                this.crossings[i][1],",",
                this.crossings[i][2],",",
                this.crossings[i][3],",",
                this.crossings[i][4],",",
                "]");
        }
        console.log ("]");
    };
    display_knottheory () { show_knottheory (); console.log(); }
  
    show_self () { console.log ("planar_diagram ", this.name); }
    display_self ()
    {
        console.log ("planar_diagram %s ", this.name);
        for (let i = 1; i <= this.crossings.lenght; i ++)
            {
            const i1 = this.crossings[i][1],
            i2 = this.crossings[i][2],
            i3 = this.crossings[i][3],
            i4 = this.crossings[i][4];
            let sep=""
            if (i1 >= 10 || i2 >= 10 || i3 >= 10 || i4 >= 10) sep=","
            console.log ("X[", 
                i1+sep+i2+sep+i3+sep+i4+sep+
                "]");
            }
        console.log ("\n");
    }
};

exports.planar_diagram=planar_diagram;