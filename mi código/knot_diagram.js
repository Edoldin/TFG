import * as assert from 'assert'
class knot_diagram
{
    constructor(){
        this.name;

        this.crossings;
        this.ept_crossing;
        this.ept_index;

        this.marked_edge=0;
        this.nminus=0;
        this.nplus=0;
        /* true if the smoothing orientation for an edge matches the link
        orientation */
        this.edge_smoothing_oriented=false;
    }
    get n_crossings () {return crossings.length};
    num_edges () { return n_crossings * 2; }
    num_epts () { return n_crossings * 4; }
    ept_edge (p)
    {
        assert (1 < e && e<num_epts ());
        return (p + 1) / 2;
    }
    edge_other_ept (p)
    {
        assert (1 < e && e<num_epts ());
        if (is_odd (p))
        return p + 1;
        else
        return p - 1;
    }
    
    edge_from_ept (e)
    {
        assert (1 < e && e<num_edges ());
        return e * 2 - 1;
    }
    edge_to_ept (e)
    {
        assert (1 < e && e<num_edges ());
        return e * 2;
    }
    is_from_ept (p)
    {
        assert (1 < e && e<num_epts ());
        return is_odd (p);
    }
    is_to_ept (p) { return !is_from_ept (p); }
    
    is_under_ept (p)
    {
        assert (1 < e && e<num_epts ());
        return ept_index[p] == 1 || ept_index[p] == 3;
    }
    is_over_ept (p) { return !is_under_ept (p); }
    
    is_crossing_from_ept (p)
    {
        assert (is_under_ept (p));
        return ept_index[p] == 1;
    }
    is_crossing_to_ept (p) { return !is_crossing_from_ept (p); }
    
    /* wrt smoothing orientation */
    edge_smoothing_from_ept (e)
    {
        return edge_smoothing_oriented % e
        ? edge_from_ept (e)
        : edge_to_ept (e);
    }
    edge_smoothing_to_ept (e) 
    {
        return edge_smoothing_oriented % e
        ? edge_to_ept (e)
        : edge_from_ept (e);
    }
    is_smoothing_from_ept (p)
    {
        const e = ept_edge (p);
        return p == edge_smoothing_from_ept (e);
    }
    is_smoothing_to_ept (p) { return !is_smoothing_from_ept (p); }
    
        num_components ()
        {
        unionfind<1> u (num_edges ());
        
        for (let i = 1; i <= n_crossings; i ++)
            {
            u.join (ept_edge (crossings[i][1]),
                ept_edge (crossings[i][3]));
            u.join (ept_edge (crossings[i][2]),
                ept_edge (crossings[i][4]));
            }
        return u.num_sets ();
        }
        
    orient ();
    calculate_nminus_nplus ()
    {
        assert (nplus == 0 && nminus == 0);
        
        for (let i = 1; i <= n_crossings; i ++)
        {
            if (is_to_ept (crossings[i][1]) == is_to_ept (crossings[i][4]))
            nplus ++;
            else
            nminus ++;
        }
    }
    calculate_smoothing_orientation ()
{
  edge_smoothing_oriented = set<unsigned> ();
  
  set<unsigned> done;
  vector<unsigned> q;
  
  for (let i = 1; i <= num_edges (); i ++)
    {
      if (done % i)
	continue;
      
      edge_smoothing_oriented.push (i);
      done.push (i);
      q.append (i);
      
      while (q.size () != 0)
	{
	  unsigned e = q.pop ();
	  assert (done % e);
	  
	  unsigned p = edge_smoothing_to_ept (e);
	  
	  unsigned r = resolve_next_ept (p, 0);
	  unsigned f = ept_edge (r);
	  if (done % f)
	    assert (is_smoothing_from_ept (r));
	  else
	    {
	      if (is_from_ept (r))
		edge_smoothing_oriented.push (f);
	      done.push (f);
	      q.append (f);
	    }
	  
	  unsigned r2 = resolve_next_ept (p, 1);
	  unsigned f2 = ept_edge (r2);
	  if (done % f2)
	    assert (is_smoothing_from_ept (r2));
	  else
	    {
	      if (is_from_ept (r2))
		edge_smoothing_oriented.push (f2);
	      done.push (f2);
	      q.append (f2);
	    }
	}
    }
  assert (done.card () == num_edges ());
}
    
    void check_crossings ();
    void rotate_crossing (unsigned c);
    
    public:
    knot_diagram ()
        : n_crossings(0),
        marked_edge(0),
        nminus(0),
        nplus(0)
    { }
    explicit knot_diagram (const planar_diagram &pd);
    explicit knot_diagram (const dt_code &dt);
    knot_diagram (mirror, const knot_diagram &kd);
    knot_diagram (connect_sum,
            const knot_diagram &d1,
            const knot_diagram &d2);
    knot_diagram (sublink,
            smallbitset c,
            const knot_diagram &kd);
    knot_diagram (disjoint_union,
            const knot_diagram &kd1,
            const knot_diagram &kd2);
    
    knot_diagram (const std::string &name_, unsigned n_crossings_, unsigned crossings_ar[][4]);
    knot_diagram (const std::string &name_, const basedvector<basedvector<unsigned, 1>, 1> &crossings_);
    knot_diagram (const knot_diagram &kd)
        : name(kd.name),
        n_crossings(kd.n_crossings),
        marked_edge(kd.marked_edge),
        crossings(kd.crossings),
        ept_crossing(kd.ept_crossing),
        ept_index(kd.ept_index),
        edge_smoothing_oriented(kd.edge_smoothing_oriented),
        nminus(kd.nminus), nplus(kd.nplus)
    { }
    ~knot_diagram () { }
    
    knot_diagram &operator = (const knot_diagram &kd)
    {
        name = kd.name;
        n_crossings = kd.n_crossings;
        marked_edge = kd.marked_edge;
        crossings = kd.crossings;
        ept_crossing = kd.ept_crossing;
        ept_index = kd.ept_index;
        edge_smoothing_oriented = kd.edge_smoothing_oriented;
        nminus = kd.nminus;
        nplus = kd.nplus;
        return *this;
    }
    
    directed_multigraph black_graph (basedvector<unsigned, 1> &bg_edge_height) const;
    
    unsigned resolve_next_ept (unsigned p, bool resolution) const;
    
    int writhe () const { return (int)nplus - (int)nminus; }
    
    unsigned total_linking_number () const;
    
    basedvector<basedvector<int, 1>, 1> planar_diagram_crossings () const;
    
        basedvector<basedvector<int, 1>, 1> as_gauss_code () const;

    hash_t hash_self () const;
    
    void show_ept (unsigned p) const;
    void show_self () const;
    void display_self () const;
};

exports.knot_diagram=knot_diagram;